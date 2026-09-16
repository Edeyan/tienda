import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware for parsing JSON and urlencoded data
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Helper for Gemini AI client with telemetry header
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API: Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        gemini: {
          configured: Boolean(process.env.GEMINI_API_KEY),
        },
      },
    });
  });

  // API: Scrape external web URL or parse content with AI
  app.post("/api/scrape-url", async (req, res) => {
    const { url, targetSection, profitMargin = 0 } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "La URL es requerida." });
    }

    try {
      let targetUrl = url.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = "https://" + targetUrl;
      }

      // Fetch webpage on server side to avoid CORS
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`El servidor remoto respondió con estado HTTP ${response.status}`);
      }

      const html = await response.text();

      // Clean HTML to save tokens and isolate text/structure
      const cleanHtml = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .slice(0, 150000); // Limit to reasonable payload size

      // Heuristic & WooCommerce/Shopify Direct Extraction Engine
      const extractProductsFromHtmlDirect = (htmlContent: string, baseUrl: string) => {
        const extracted: any[] = [];
        
        // 1. WooCommerce pattern
        const wooBlocks = htmlContent.split(/<li[^>]*class=["\x27][^"\x27]*product/i).slice(1);
        if (wooBlocks.length > 0) {
          for (let i = 0; i < wooBlocks.length; i++) {
            const block = wooBlocks[i];
            let title = block.match(/woocommerce-loop-product__title[^>]*>(.*?)<\/h/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
            title = title.replace(/^[\s*•-]+/, '').trim();

            const priceMatches = [...block.matchAll(/<bdi>([\s\S]*?)<\/bdi>/gi)]
              .map(m => {
                const cleaned = m[1].replace(/<[^>]+>/g, '').replace(/&#36;/g, '').replace(/\$/g, '').replace(/,/g, '').trim();
                return parseFloat(cleaned);
              })
              .filter(n => !isNaN(n) && n > 0);

            const rawPrice = priceMatches.length > 0 ? priceMatches[priceMatches.length - 1] : 0;
            const originalPrice = priceMatches.length > 1 ? priceMatches[0] : rawPrice;

            let img = block.match(/<img[^>]+src=["\x27]([^"\x27]+)["\x27]/i)?.[1] || 
                      block.match(/data-src=["\x27]([^"\x27]+)["\x27]/i)?.[1] ||
                      block.match(/data-lazy-src=["\x27]([^"\x27]+)["\x27]/i)?.[1] || '';

            if (img && !img.startsWith('http')) {
              try {
                img = new URL(img, baseUrl).href;
              } catch {
                // ignore
              }
            }

            if (title && rawPrice > 0) {
              // Categorize section
              const lower = (title + ' ' + block).toLowerCase();
              let sec = 'ferreteria';
              let cat = 'all';
              let brand = 'MISHOZUKI';

              if (/moto|scooter|triciclo|ebike|bicimoto|coyote|shark|buho|racing|chasis|motor|freno/i.test(lower)) {
                sec = 'vehiculos';
                cat = /scooter/i.test(lower) ? 'scooter_electrico' : /triciclo/i.test(lower) ? 'triciclos' : 'moto_electrica';
              } else if (/bateria|batería|lithium|litio|lifepo4|cargador|celda|72v|60v|48v/i.test(lower)) {
                sec = 'baterias';
                cat = /lifepo4/i.test(lower) ? 'bateria_lipo4' : 'bateria_moto';
              } else if (/abanico|ventilador|luxor|recargable|pedestal|mesa/i.test(lower)) {
                sec = 'ventiladores';
                cat = 'recargable';
              } else if (/bicicleta|asiento|manillar|tubo|cadena/i.test(lower)) {
                sec = 'bicicletas';
                cat = 'piezas_bici';
              } else if (/aire|split|inverter|prolux/i.test(lower)) {
                sec = 'ferreteria';
                cat = 'all';
                brand = 'LUXOR';
              }

              if (targetSection && targetSection !== 'all') {
                sec = targetSection;
              }

              let finalPrice = rawPrice;
              if (profitMargin > 0) {
                finalPrice = Number((finalPrice * (1 + profitMargin / 100)).toFixed(2));
              }

              extracted.push({
                name: title,
                price: finalPrice,
                costPrice: Number((rawPrice * 0.70).toFixed(2)),
                category: cat,
                section: sec,
                brand: brand,
                sku: `MSK-${Math.floor(1000 + Math.random() * 9000)}`,
                image: img || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80',
                description: `Producto original importado desde ${baseUrl}. Precio de referencia: $${originalPrice}`,
                specs: {
                  'MARCA': brand,
                  'ORIGEN': 'Catálogo Mishozuki Motos',
                  'DISPONIBILIDAD': 'En Stock'
                },
                stock: 12
              });
            }
          }
        }
        return extracted;
      };

      const directProducts = extractProductsFromHtmlDirect(html, targetUrl);

      const ai = getGeminiClient();

      if (ai) {
        const prompt = `Analiza el siguiente contenido extraído de la tienda/web "${targetUrl}".
Extrae la lista de todos los productos disponibles con sus nombres, precios de venta, costos estimados, marcas, códigos SKU o referencias, descripciones, categorías/secciones y fotos (si hay URLs de imagen absolutas o relativas).

SECCIONES DISPONIBLES EN NUESTRA TIENDA:
- vehiculos (motos eléctricas, bicimoto, triciclos, repuestos)
- ferreteria (herramientas, tornillos, llavines, cerraduras, cables, pinturas, discos)
- calzado (deportivo, formal, casual, botas)
- baterias (litio, LiFePO4, moto, bicicleta, celdas)
- ropa (hombre, mujer, niños, deportiva, vestidos)
- ventiladores (recargables, pie, f6, 20.000mah, 40.000mah)
- bicicletas (piezas, accesorios, ruedas, frenos)

Si targetSection está especificado ("${targetSection || 'auto'}"), prioriza esa sección si encaja.

Devuelve los datos de forma estricta según el esquema JSON solicitado. Extrae tantos productos como encuentres (máximo 40 productos por página).

CONTENIDO DE LA PÁGINA:
${cleanHtml.slice(0, 45000)}`;

        try {
          const aiResponse = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  siteTitle: { type: Type.STRING },
                  totalDetected: { type: Type.INTEGER },
                  products: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        price: { type: Type.NUMBER },
                        costPrice: { type: Type.NUMBER },
                        category: { type: Type.STRING },
                        section: { type: Type.STRING },
                        brand: { type: Type.STRING },
                        sku: { type: Type.STRING },
                        image: { type: Type.STRING },
                        description: { type: Type.STRING },
                        specs: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              key: { type: Type.STRING },
                              value: { type: Type.STRING },
                            },
                            required: ["key", "value"],
                          },
                        },
                      },
                      required: ["name", "price", "section", "category", "brand", "sku"],
                    },
                  },
                },
                required: ["products"],
              },
            },
          });

          const rawText = aiResponse.text?.trim() || "{}";
          const parsed = JSON.parse(rawText);

          // Normalize specs & ensure complete fields
          const formattedProducts = (parsed.products || []).map((p: any, idx: number) => {
            const specsObj: Record<string, string> = {};
            if (Array.isArray(p.specs)) {
              p.specs.forEach((s: any) => {
                if (s && s.key) specsObj[s.key.toUpperCase()] = String(s.value);
              });
            }
            if (!specsObj["MARCA"] && p.brand) specsObj["MARCA"] = p.brand;
            if (!specsObj["ORIGEN"]) specsObj["ORIGEN"] = "Web Importada";

            let finalPrice = Number(p.price) || 19.99;
            if (profitMargin > 0) {
              finalPrice = Number((finalPrice * (1 + profitMargin / 100)).toFixed(2));
            }

            return {
              name: p.name || `Producto Web #${idx + 1}`,
              price: finalPrice,
              costPrice: Number(p.costPrice) || Number((finalPrice * 0.65).toFixed(2)),
              category: p.category || "all",
              section: p.section || targetSection || "ferreteria",
              brand: p.brand || "IMPORTADO",
              sku: p.sku || `WEB-${Math.floor(1000 + Math.random() * 9000)}`,
              image: p.image && p.image.startsWith("http")
                ? p.image
                : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
              description: p.description || `Importado desde ${targetUrl}`,
              specs: specsObj,
              stock: 15,
            };
          });

          if (formattedProducts.length > 0) {
            return res.json({
              success: true,
              source: targetUrl,
              total: formattedProducts.length,
              products: formattedProducts,
            });
          }
        } catch (aiErr) {
          console.warn("AI generation failed, using direct extraction fallback:", aiErr);
        }
      }

      // If direct extraction found products, return them!
      if (directProducts.length > 0) {
        return res.json({
          success: true,
          source: targetUrl,
          total: directProducts.length,
          products: directProducts,
        });
      }

      // Fallback if neither produced items
      return res.json({
        success: true,
        source: targetUrl,
        fallbackMode: true,
        rawHtmlExcerpt: cleanHtml.slice(0, 10000),
        products: [],
        message: "Página descargada pero no se detectaron tarjetas de productos estándar.",
      });
    } catch (err: any) {
      console.error("Error scraping URL:", err);
      res.status(500).json({
        error: `No se pudo acceder a la URL: ${err.message || "Error de red o conexión bloqueada"}`,
      });
    }
  });

  // API: Parse text, tables, CSV or raw catalog description with Gemini AI
  app.post("/api/parse-products-ai", async (req, res) => {
    const { text, targetSection, profitMargin = 0, defaultBrand } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "El texto o datos a analizar son requeridos." });
    }

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(503).json({
          error: "El servicio de IA requiere una clave GEMINI_API_KEY configurada.",
        });
      }

      const prompt = `Analiza el siguiente texto, tabla, lista o catálogo de productos con sus precios.
Extrae TODOS los productos individuales como un listado estructurado para nuestro catálogo.

SECCIONES DISPONIBLES:
- vehiculos (motos eléctricas, bicimoto, triciclos, repuestos)
- ferreteria (herramientas, tornillos, llavines, cerraduras, cables, pinturas, discos)
- calzado (deportivo, formal, casual, botas)
- baterias (litio, LiFePO4, moto, bicicleta, celdas)
- ropa (hombre, mujer, niños, deportiva, vestidos)
- ventiladores (recargables, pie, f6, 20.000mah, 40.000mah)
- bicicletas (piezas, accesorios, ruedas, frenos)

Si se especificó sección sugerida: "${targetSection || 'detectar automáticamente'}".
Si se especificó marca por defecto: "${defaultBrand || 'auto-detectar'}".

TEXTO O DATOS A PROCESAR:
${text.slice(0, 50000)}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              products: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    costPrice: { type: Type.NUMBER },
                    category: { type: Type.STRING },
                    section: { type: Type.STRING },
                    brand: { type: Type.STRING },
                    sku: { type: Type.STRING },
                    image: { type: Type.STRING },
                    description: { type: Type.STRING },
                    specs: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          key: { type: Type.STRING },
                          value: { type: Type.STRING },
                        },
                        required: ["key", "value"],
                      },
                    },
                  },
                  required: ["name", "price", "section", "category", "brand", "sku"],
                },
              },
            },
            required: ["products"],
          },
        },
      });

      const rawText = aiResponse.text?.trim() || "{}";
      const parsed = JSON.parse(rawText);

      const formattedProducts = (parsed.products || []).map((p: any, idx: number) => {
        const specsObj: Record<string, string> = {};
        if (Array.isArray(p.specs)) {
          p.specs.forEach((s: any) => {
            if (s && s.key) specsObj[s.key.toUpperCase()] = String(s.value);
          });
        }
        if (!specsObj["MARCA"] && p.brand) specsObj["MARCA"] = p.brand;

        let finalPrice = Number(p.price) || 19.99;
        if (profitMargin > 0) {
          finalPrice = Number((finalPrice * (1 + profitMargin / 100)).toFixed(2));
        }

        return {
          name: p.name || `Producto #${idx + 1}`,
          price: finalPrice,
          costPrice: Number(p.costPrice) || Number((finalPrice * 0.65).toFixed(2)),
          category: p.category || "all",
          section: p.section || targetSection || "ferreteria",
          brand: p.brand || defaultBrand || "IMPORTADO",
          sku: p.sku || `IMP-${Math.floor(1000 + Math.random() * 9000)}`,
          image: p.image && p.image.startsWith("http")
            ? p.image
            : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
          description: p.description || "Producto importado de catálogo externo.",
          specs: specsObj,
          stock: 20,
        };
      });

      return res.json({
        success: true,
        total: formattedProducts.length,
        products: formattedProducts,
      });
    } catch (err: any) {
      console.error("Error in parse-products-ai:", err);
      res.status(500).json({ error: `Error procesando datos con IA: ${err.message}` });
    }
  });

  // API: AI Assistant Chat (Enhanced with structured recommendations & quick actions)
  app.post("/api/chat", async (req, res) => {
    const { message, context, cartItems = [], activeSection, productsList = [] } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensaje requerido." });
    }

    try {
      const ai = getGeminiClient();

      // Heuristic fallback matching in case AI is offline or has no key
      const getHeuristicResponse = () => {
        const q = message.toLowerCase();
        let matched: any[] = [];
        
        if (productsList.length > 0) {
          matched = productsList.filter((p: any) => {
            const name = (p.name || '').toLowerCase();
            const brand = (p.brand || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();
            const sec = (p.section || '').toLowerCase();
            return q.split(' ').some((word: string) => word.length > 3 && (name.includes(word) || brand.includes(word) || cat.includes(word) || sec.includes(word)));
          }).slice(0, 3);
        }

        let reply = "¡Hola! Con gusto te asesoro. ";
        if (matched.length > 0) {
          reply += `He encontrado estas excelentes opciones en nuestro catálogo que coinciden con tu búsqueda:\n`;
        } else if (q.includes('bateria') || q.includes('batería')) {
          reply += "Contamos con baterías de litio y LiFePO4 de 48V, 60V y 72V de alto rendimiento y celdas grado A.";
        } else if (q.includes('moto') || q.includes('scooter') || q.includes('triciclo')) {
          reply += "Disponemos de motos eléctricas, scooters y triciclos de alta autonomía y garantía oficial.";
        } else if (q.includes('envio') || q.includes('entrega') || q.includes('domicilio')) {
          reply += "Realizamos envíos rápidos y seguros a todo el país. Puedes rastrear tu pedido en la sección de seguimiento.";
        } else {
          reply += "Tenemos un catálogo completo en vehículos, repuestos, baterías, ferretería, calzado y más. ¿Buscas algo en específico?";
        }

        return {
          response: reply,
          recommendedProductIds: matched.map((p: any) => p.id),
          quickReplies: ["🛵 Motos Eléctricas", "🔋 Baterías 72V", "⚡ Ofertas del día", "📦 Seguimiento de pedido"]
        };
      };

      if (!ai) {
        return res.json(getHeuristicResponse());
      }

      const cartContext = cartItems.length > 0
        ? `Artículos actuales en carrito:\n${cartItems.map((c: any) => `- ${c.name} ($${c.price})`).join('\n')}`
        : 'Carrito vacío.';

      const prompt = `Eres el Asistente Virtual de Ventas y Soporte Técnico de "BUSINESS" (tienda líder en vehículos eléctricos, baterías LiFePO4, repuestos, ferretería, calzado y artículos para el hogar).
Tu misión es brindar atención VIP, asesorar técnicamente con calidez, resolver dudas sobre precios y características, y recomendar los productos más adecuados.

Sección activa del usuario: ${activeSection || 'General'}
${cartContext}

Catálogo disponible (resumen con IDs para recomendación):
${context || 'Catálogo general de BUSINESS'}

Pregunta o mensaje del cliente:
"${message}"

INSTRUCCIONES:
1. Responde de forma cordial, atractiva, profesional y concisa (máximo 3 párrafos cortos). Usa formato markdown limpio (negritas, viñetas si es necesario).
2. Si la consulta se relaciona con productos del catálogo, selecciona entre 1 y 4 IDs exactos de productos para la lista "recommendedProductIds".
3. Proporciona entre 2 y 4 preguntas de seguimiento útiles en "quickReplies" (cortas, con emoji).

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
{
  "response": "Texto de tu respuesta al cliente...",
  "recommendedProductIds": ["id1", "id2"],
  "quickReplies": ["🛵 Ver motos 72V", "🔋 Baterías LiFePO4", "📦 Consultar envíos"]
}`;

      try {
        const aiResponse = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const rawText = aiResponse.text?.trim() || "{}";
        let parsed: any = {};
        try {
          parsed = JSON.parse(rawText);
        } catch {
          parsed = { response: rawText, recommendedProductIds: [], quickReplies: [] };
        }

        return res.json({
          response: parsed.response || "Aquí tienes información relevante de nuestro catálogo.",
          recommendedProductIds: Array.isArray(parsed.recommendedProductIds) ? parsed.recommendedProductIds : [],
          quickReplies: Array.isArray(parsed.quickReplies) && parsed.quickReplies.length > 0 
            ? parsed.quickReplies 
            : ["🛵 Ver Vehículos", "🔋 Baterías", "⚡ Ofertas"]
        });
      } catch (geminiErr: any) {
        console.warn("Gemini generation failed, fallback to heuristic:", geminiErr?.message);
        return res.json(getHeuristicResponse());
      }
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: "Hubo un error al procesar tu solicitud." });
    }
  });

  // API: AI Product Advisor for Product Detail Modal
  app.post("/api/product-advisor", async (req, res) => {
    const { product } = req.body;
    if (!product || !product.name) {
      return res.status(400).json({ error: "Datos de producto requeridos." });
    }

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          highlights: [
            "Excelente relación calidad-precio garantizada.",
            "Garantía oficial con soporte de repuestos disponibles.",
            "Alta durabilidad y rendimiento verificado."
          ],
          idealFor: "Ideal para usuarios que buscan fiabilidad y máxima eficiencia.",
          accessoriesAdvice: "Te recomendamos acompañarlo con accesorios y cargadores originales de nuestra tienda."
        });
      }

      const prompt = `Analiza el siguiente producto del catálogo y genera un informe de asesoría comercial y técnica ultraconciso para el cliente:
Producto: "${product.name}"
Categoría: "${product.category || 'General'}"
Precio: $${product.price}
Descripción: "${product.description || ''}"
Especificaciones: ${JSON.stringify(product.specs || {})}

Genera un JSON con:
1. "highlights": Array con 3 puntos fuertes / beneficios clave del producto (máximo 12 palabras cada uno).
2. "idealFor": Frase corta que describe para quién o para qué situación es perfecto este producto (máximo 15 palabras).
3. "accessoriesAdvice": Recomendación de accesorios o cuidados clave (máximo 20 palabras).

Responde ÚNICAMENTE en formato JSON:
{
  "highlights": ["Punto 1", "Punto 2", "Punto 3"],
  "idealFor": "...",
  "accessoriesAdvice": "..."
}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(aiResponse.text?.trim() || "{}");
      return res.json(parsed);
    } catch (err: any) {
      console.warn("Product Advisor error:", err);
      return res.json({
        highlights: [
          "Producto probado con altos estándares de calidad.",
          "Disponibilidad inmediata para entrega o despacho.",
          "Respaldado por el catálogo oficial de BUSINESS."
        ],
        idealFor: "Perfecto para uso diario con máximo rendimiento.",
        accessoriesAdvice: "Consulta con nuestro asistente en el chat para paquetes y compatibilidad."
      });
    }
  });

  // API: AI Cart Suggestions
  app.post("/api/cart-suggestions", async (req, res) => {
    const { cartItems, catalog } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.json({ suggestions: [] });
    }

    try {
      const ai = getGeminiClient();
      if (!ai) {
        // Fallback recommendations if offline
        const cartCategories = new Set(cartItems.map((c: any) => c.category));
        const fallbacks = (catalog || [])
          .filter((p: any) => !cartItems.some((c: any) => c.id === p.id))
          .slice(0, 3)
          .map((p: any) => ({
            productId: p.id,
            reason: "Accesorio complementario recomendado para tu compra."
          }));
        return res.json({ suggestions: fallbacks });
      }

      const cartSummary = cartItems.map((item: any) => `- ID: "${item.id}", Nombre: "${item.name}", Categoría: "${item.category}"`).join('\n');
      const catalogSummary = (catalog || []).map((prod: any) => `- ID: "${prod.id}", Nombre: "${prod.name}", Categoría: "${prod.category}", Precio: $${prod.price}`).join('\n');

      const prompt = `Analiza los artículos que el cliente tiene en su carrito de compras y recomienda entre 1 y 3 productos COMPLEMENTARIOS o RELACIONADOS del catálogo disponible (por ejemplo: accesorios, cascos, repuestos compatibles, baterías, cargadores o productos de categorías afines).
NO sugieras productos que ya estén en el carrito del cliente.

Artículos en el carrito:
${cartSummary}

Catálogo disponible:
${catalogSummary}

Devuelve ÚNICAMENTE un arreglo JSON con el siguiente formato, sin bloques markdown ni texto adicional:
[
  {
    "productId": "id_del_producto",
    "reason": "Explicación breve y vendedora de por qué complementa su compra (máximo 15 palabras)"
  }
]`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = aiResponse.text?.trim() || "[]";
      let suggestions = [];
      try {
        suggestions = JSON.parse(responseText);
      } catch (parseError) {
        console.warn("Failed to parse JSON suggestions:", responseText);
      }

      return res.json({ suggestions });
    } catch (error: any) {
      console.error("AI Cart Suggestions Error:", error);
      return res.json({ suggestions: [] });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BUSINESS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
