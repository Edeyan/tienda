import json
import re

items = [
  {
    "id": "nuevo_10678",
    "name": "GUANTE REFORZADO MEGAPRO",
    "price": 1.33,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-GTBC105",
    "specs": {
      "CÓDIGO": "10678",
      "MODELO": "MP-GTBC105",
      "EMPAQUE": "120 SETS",
      "PESO": "16.300KG",
      "PIE/CUB": "2.1692",
      "CBM": "0.061",
      "INVENTARIO": "1200 SETS"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1200,
    "description": "GUANTE REFORZADO MEGAPRO. Modelo: MP-GTBC105, Código: 10678. Empaque: 120 SETS, Peso: 16.300KG, CBM: 0.061. Stock disponible: 1200 SETS."
  },
  {
    "id": "nuevo_10748",
    "name": "GUIA PARA PORTON 40X50 NEGRA MEGAPRO",
    "price": 0.37,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-40X50GPPN",
    "specs": {
      "CÓDIGO": "10748",
      "MODELO": "MP-40X50GPPN",
      "EMPAQUE": "100 PZA",
      "PESO": "30.000KG",
      "PIE/CUB": "0.7568",
      "CBM": "0.021",
      "INVENTARIO": "2 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 2,
    "description": "GUIA PARA PORTON 40X50 NEGRA MEGAPRO. Modelo: MP-40X50GPPN, Código: 10748. Empaque: 100 PZA, Peso: 30.000KG, CBM: 0.021. Stock disponible: 2 PZA."
  },
  {
    "id": "nuevo_11454",
    "name": "HACHA MANGO ERGONOMICO 2 KG MEGAPRO",
    "price": 7.95,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-HFV-2KG",
    "specs": {
      "CÓDIGO": "11454",
      "MODELO": "MP-HFV-2KG",
      "EMPAQUE": "6 PZA",
      "PESO": "15.350KG",
      "PIE/CUB": "1.2328",
      "CBM": "0.035",
      "INVENTARIO": "36 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 36,
    "description": "HACHA MANGO ERGONOMICO 2 KG MEGAPRO. Modelo: MP-HFV-2KG, Código: 11454. Empaque: 6 PZA, Peso: 15.350KG, CBM: 0.035. Stock disponible: 36 PZA."
  },
  {
    "id": "nuevo_12892",
    "name": "HIDROJET 1200 WATT MEGAPRO",
    "price": 35.76,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-H1200W",
    "specs": {
      "CÓDIGO": "12892",
      "MODELO": "MP-H1200W",
      "EMPAQUE": "1 PZA",
      "PESO": "5.502KG",
      "PIE/CUB": "0.0000",
      "CBM": "0.023",
      "INVENTARIO": "100 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 100,
    "description": "HIDROJET 1200 WATT MEGAPRO. Modelo: MP-H1200W, Código: 12892. Empaque: 1 PZA, Peso: 5.502KG, CBM: 0.023. Stock disponible: 100 PZA."
  },
  {
    "id": "nuevo_12140",
    "name": "HOYADOR MEGAPRO",
    "price": 69.78,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PDS52C",
    "specs": {
      "CÓDIGO": "12140",
      "MODELO": "MP-PDS52C",
      "EMPAQUE": "1 PZA",
      "PESO": "11.210KG",
      "PIE/CUB": "1.5185",
      "CBM": "0.043",
      "INVENTARIO": "1 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1,
    "description": "HOYADOR MEGAPRO. Modelo: MP-PDS52C, Código: 12140. Empaque: 1 PZA, Peso: 11.210KG, CBM: 0.043. Stock disponible: 1 PZA."
  },
  {
    "id": "nuevo_11456",
    "name": "JUEGO DE RACHE 1/4 PULG. 11 PCS MEGAPRO",
    "price": 3.24,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-R1411PC",
    "specs": {
      "CÓDIGO": "11456",
      "MODELO": "MP-R1411PC",
      "EMPAQUE": "30 PZA",
      "PESO": "11.350KG",
      "PIE/CUB": "0.5858",
      "CBM": "0.017",
      "INVENTARIO": "869 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 869,
    "description": "JUEGO DE RACHE 1/4 PULG. 11 PCS MEGAPRO. Modelo: MP-R1411PC, Código: 11456. Empaque: 30 PZA, Peso: 11.350KG, CBM: 0.017. Stock disponible: 869 PZA."
  },
  {
    "id": "nuevo_11224",
    "name": "LAMPARA DE EMERGENCIA 3 WATT MEGAPRO",
    "price": 7.91,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-LEG3W",
    "specs": {
      "CÓDIGO": "11224",
      "MODELO": "MP-LEG3W",
      "EMPAQUE": "10 PZA",
      "PESO": "8.400KG",
      "PIE/CUB": "2.2460",
      "CBM": "0.064",
      "INVENTARIO": "24 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 24,
    "description": "LAMPARA DE EMERGENCIA 3 WATT MEGAPRO. Modelo: MP-LEG3W, Código: 11224. Empaque: 10 PZA, Peso: 8.400KG, CBM: 0.064. Stock disponible: 24 PZA."
  },
  {
    "id": "nuevo_10341",
    "name": "LAMPARA LED REDONDA 12 WATT MEGAPRO",
    "price": 1.29,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PLC80W01 12W",
    "specs": {
      "CÓDIGO": "10341",
      "MODELO": "MP-PLC80W01 12W",
      "EMPAQUE": "40 PZA",
      "PESO": "10.300KG",
      "PIE/CUB": "1.8834",
      "CBM": "0.053",
      "INVENTARIO": "480 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 480,
    "description": "LAMPARA LED REDONDA 12 WATT MEGAPRO. Modelo: MP-PLC80W01 12W, Código: 10341. Empaque: 40 PZA, Peso: 10.300KG, CBM: 0.053. Stock disponible: 480 PZA."
  },
  {
    "id": "nuevo_10044",
    "name": "LAMPARA PARA EXTERIOR 50 WATT MEGAPRO",
    "price": 4.10,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-R5016012032",
    "specs": {
      "CÓDIGO": "10044",
      "MODELO": "MP-R5016012032",
      "EMPAQUE": "40 PZA",
      "PESO": "19.900KG",
      "PIE/CUB": "2.0196",
      "CBM": "0.057",
      "INVENTARIO": "40 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 40,
    "description": "LAMPARA PARA EXTERIOR 50 WATT MEGAPRO. Modelo: MP-R5016012032, Código: 10044. Empaque: 40 PZA, Peso: 19.900KG, CBM: 0.057. Stock disponible: 40 PZA."
  },
  {
    "id": "nuevo_11524",
    "name": "LENTES DE SEGURIDAD MEGAPRO",
    "price": 0.69,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-QB1203-ASPC",
    "specs": {
      "CÓDIGO": "11524",
      "MODELO": "MP-QB1203-ASPC",
      "EMPAQUE": "300 PZA",
      "PESO": "10.000KG",
      "PIE/CUB": "4.7011",
      "CBM": "0.133",
      "INVENTARIO": "12 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 12,
    "description": "LENTES DE SEGURIDAD MEGAPRO. Modelo: MP-QB1203-ASPC, Código: 11524. Empaque: 300 PZA, Peso: 10.000KG, CBM: 0.133. Stock disponible: 12 PZA."
  },
  {
    "id": "nuevo_11519",
    "name": "LENTES DE SEGURIDAD MEGAPRO",
    "price": 0.45,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-QB1213",
    "specs": {
      "CÓDIGO": "11519",
      "MODELO": "MP-QB1213",
      "EMPAQUE": "300 PZA",
      "PESO": "15.000KG",
      "PIE/CUB": "4.9379",
      "CBM": "0.140",
      "INVENTARIO": "300 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 300,
    "description": "LENTES DE SEGURIDAD MEGAPRO. Modelo: MP-QB1213, Código: 11519. Empaque: 300 PZA, Peso: 15.000KG, CBM: 0.140. Stock disponible: 300 PZA."
  },
  {
    "id": "nuevo_11525",
    "name": "LENTES DE SEGURIDAD MEGAPRO",
    "price": 0.86,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-QB1209E-ASPCE",
    "specs": {
      "CÓDIGO": "11525",
      "MODELO": "MP-QB1209E-ASPCE",
      "EMPAQUE": "300 PZA",
      "PESO": "11.000KG",
      "PIE/CUB": "3.7530",
      "CBM": "0.106",
      "INVENTARIO": "300 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 300,
    "description": "LENTES DE SEGURIDAD MEGAPRO. Modelo: MP-QB1209E-ASPCE, Código: 11525. Empaque: 300 PZA, Peso: 11.000KG, CBM: 0.106. Stock disponible: 300 PZA."
  },
  {
    "id": "nuevo_12637",
    "name": "LLAVE DE IMPACTO 550NM MEGAPRO",
    "price": 49.00,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-LDI3P",
    "specs": {
      "CÓDIGO": "12637",
      "MODELO": "MP-LDI3P",
      "EMPAQUE": "4 PZA",
      "PESO": "15.300KG",
      "PIE/CUB": "1.8693",
      "CBM": "0.053",
      "INVENTARIO": "60 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 60,
    "description": "LLAVE DE IMPACTO 550NM MEGAPRO. Modelo: MP-LDI3P, Código: 12637. Empaque: 4 PZA, Peso: 15.300KG, CBM: 0.053. Stock disponible: 60 PZA."
  },
  {
    "id": "nuevo_12894",
    "name": "LLAVE DE CRUZ MEGAPRO",
    "price": 2.49,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-LLC23-1",
    "specs": {
      "CÓDIGO": "12894",
      "MODELO": "MP-LLC23-1",
      "EMPAQUE": "20 PZA",
      "PESO": "20.000KG",
      "PIE/CUB": "0.0000",
      "CBM": "0.030",
      "INVENTARIO": "120 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 120,
    "description": "LLAVE DE CRUZ MEGAPRO. Modelo: MP-LLC23-1, Código: 12894. Empaque: 20 PZA, Peso: 20.000KG, CBM: 0.030. Stock disponible: 120 PZA."
  },
  {
    "id": "nuevo_10052",
    "name": "MACRO FIBRA PARA CONCRETO MEGAPRO",
    "price": 2.95,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MCPPU54MM",
    "specs": {
      "CÓDIGO": "10052",
      "MODELO": "MP-MCPPU54MM",
      "EMPAQUE": "28 PZA",
      "PESO": "18.200KG",
      "PIE/CUB": "1.8180",
      "CBM": "0.052",
      "INVENTARIO": "20 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 20,
    "description": "MACRO FIBRA PARA CONCRETO MEGAPRO. Modelo: MP-MCPPU54MM, Código: 10052. Empaque: 28 PZA, Peso: 18.200KG, CBM: 0.052. Stock disponible: 20 PZA."
  },
  {
    "id": "nuevo_11819",
    "name": "MALLA CUADROS ELECTRO GALVANIZADA 1 1*25 MT MEGAPRO",
    "price": 9.49,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MCE1",
    "specs": {
      "CÓDIGO": "11819",
      "MODELO": "MP-MCE1",
      "EMPAQUE": "1 PZA",
      "PESO": "5.400KG",
      "PIE/CUB": "0.4414",
      "CBM": "0.013",
      "INVENTARIO": "80 PZA"
    },
    "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 80,
    "description": "MALLA CUADROS ELECTRO GALVANIZADA 1 1*25 MT MEGAPRO. Modelo: MP-MCE1, Código: 11819. Empaque: 1 PZA, Peso: 5.400KG, CBM: 0.013. Stock disponible: 80 PZA."
  },
  {
    "id": "nuevo_11826",
    "name": "MALLA DE ALAMBRE CUADRADO 6X6 1*15 MT MEGAPRO",
    "price": 20.15,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MCT6X615M",
    "specs": {
      "CÓDIGO": "11826",
      "MODELO": "MP-MCT6X615M",
      "EMPAQUE": "1 PZA",
      "PESO": "5.520KG",
      "PIE/CUB": "0.3885",
      "CBM": "0.011",
      "INVENTARIO": "5 PZA"
    },
    "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 5,
    "description": "MALLA DE ALAMBRE CUADRADO 6X6 1*15 MT MEGAPRO. Modelo: MP-MCT6X615M, Código: 11826. Empaque: 1 PZA, Peso: 5.520KG, CBM: 0.011. Stock disponible: 5 PZA."
  },
  {
    "id": "nuevo_11815",
    "name": "MALLA HEXAGONAL 1/2 1*25 MT MEGAPRO",
    "price": 16.54,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MHG1-225",
    "specs": {
      "CÓDIGO": "11815",
      "MODELO": "MP-MHG1-225",
      "EMPAQUE": "1 PZA",
      "PESO": "12.100KG",
      "PIE/CUB": "0.8554",
      "CBM": "0.020",
      "INVENTARIO": "209 PZA"
    },
    "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 209,
    "description": "MALLA HEXAGONAL 1/2 1*25 MT MEGAPRO. Modelo: MP-MHG1-225, Código: 11815. Empaque: 1 PZA, Peso: 12.100KG, CBM: 0.020. Stock disponible: 209 PZA."
  },
  {
    "id": "nuevo_10952",
    "name": "MALLA P/IMPERMEABILIZAR CON PINT. EPOXICA 50M MEGAPRO",
    "price": 23.45,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MAIMP50M",
    "specs": {
      "CÓDIGO": "10952",
      "MODELO": "MP-MAIMP50M",
      "EMPAQUE": "2 PZA",
      "PESO": "22.000KG",
      "PIE/CUB": "3.5784",
      "CBM": "0.101",
      "INVENTARIO": "60 PZA"
    },
    "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 60,
    "description": "MALLA P/IMPERMEABILIZAR CON PINT. EPOXICA 50M MEGAPRO. Modelo: MP-MAIMP50M, Código: 10952. Empaque: 2 PZA, Peso: 22.000KG, CBM: 0.101. Stock disponible: 60 PZA."
  },
  {
    "id": "nuevo_10136",
    "name": "MANGO CON RODILLO PARA PINTAR MEGAPRO",
    "price": 1.09,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-RPWP742",
    "specs": {
      "CÓDIGO": "10136",
      "MODELO": "MP-RPWP742",
      "EMPAQUE": "60 PZA",
      "PESO": "14.000KG",
      "PIE/CUB": "2.4296",
      "CBM": "0.069",
      "INVENTARIO": "1200 PZA"
    },
    "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1200,
    "description": "MANGO CON RODILLO PARA PINTAR MEGAPRO. Modelo: MP-RPWP742, Código: 10136. Empaque: 60 PZA, Peso: 14.000KG, CBM: 0.069. Stock disponible: 1200 PZA."
  },
  {
    "id": "nuevo_11639",
    "name": "MANGUERA DE PRESION 1/4 MEGAPRO",
    "price": 7.69,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MR14",
    "specs": {
      "CÓDIGO": "11639",
      "MODELO": "MP-MR14",
      "EMPAQUE": "6 PZA",
      "PESO": "17.170KG",
      "PIE/CUB": "1.6209",
      "CBM": "0.046",
      "INVENTARIO": "8 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 8,
    "description": "MANGUERA DE PRESION 1/4 MEGAPRO. Modelo: MP-MR14, Código: 11639. Empaque: 6 PZA, Peso: 17.170KG, CBM: 0.046. Stock disponible: 8 PZA."
  },
  {
    "id": "nuevo_10616",
    "name": "MAQUINA DE SOLDAR 160 AMP PUMA MEGAPRO",
    "price": 60.19,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-WM-630063",
    "specs": {
      "CÓDIGO": "10616",
      "MODELO": "MP-WM-630063",
      "EMPAQUE": "1 PZA",
      "PESO": "5.400KG",
      "PIE/CUB": "0.4265",
      "CBM": "0.012",
      "INVENTARIO": "171 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 171,
    "description": "MAQUINA DE SOLDAR 160 AMP PUMA MEGAPRO. Modelo: MP-WM-630063, Código: 10616. Empaque: 1 PZA, Peso: 5.400KG, CBM: 0.012. Stock disponible: 171 PZA."
  },
  {
    "id": "nuevo_10623",
    "name": "MASCARA MEGAPRO",
    "price": 2.07,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "TADS001",
    "specs": {
      "CÓDIGO": "10623",
      "MODELO": "TADS001",
      "EMPAQUE": "100 PZA",
      "PESO": "16.200KG",
      "PIE/CUB": "5.0323",
      "CBM": "0.143",
      "INVENTARIO": "294 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 294,
    "description": "MASCARA MEGAPRO. Modelo: TADS001, Código: 10623. Empaque: 100 PZA, Peso: 16.200KG, CBM: 0.143. Stock disponible: 294 PZA."
  },
  {
    "id": "nuevo_12390",
    "name": "MARCO CON SEGUETA MEGAPRO",
    "price": 1.42,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-SPS3058",
    "specs": {
      "CÓDIGO": "12390",
      "MODELO": "MP-SPS3058",
      "EMPAQUE": "48 PZA",
      "PESO": "13.700KG",
      "PIE/CUB": "1.6895",
      "CBM": "0.048",
      "INVENTARIO": "1728 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1728,
    "description": "MARCO CON SEGUETA MEGAPRO. Modelo: MP-SPS3058, Código: 12390. Empaque: 48 PZA, Peso: 13.700KG, CBM: 0.048. Stock disponible: 1728 PZA."
  },
  {
    "id": "nuevo_10626",
    "name": "MASCARA MEGAPRO",
    "price": 1.76,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PFPFS",
    "specs": {
      "CÓDIGO": "10626",
      "MODELO": "MP-PFPFS",
      "EMPAQUE": "40 SETS",
      "PESO": "13.300KG",
      "PIE/CUB": "4.1954",
      "CBM": "0.119",
      "INVENTARIO": "1118 SETS"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1118,
    "description": "MASCARA MEGAPRO. Modelo: MP-PFPFS, Código: 10626. Empaque: 40 SETS, Peso: 13.300KG, CBM: 0.119. Stock disponible: 1118 SETS."
  },
  {
    "id": "nuevo_10791",
    "name": "MECATE 8MM MEGAPRO",
    "price": 32.63,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MA838",
    "specs": {
      "CÓDIGO": "10791",
      "MODELO": "MP-MA838",
      "EMPAQUE": "1 PZA",
      "PESO": "10.433KG",
      "PIE/CUB": "1.0300",
      "CBM": "0.029",
      "INVENTARIO": "1 PZA"
    },
    "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1,
    "description": "MECATE 8MM MEGAPRO. Modelo: MP-MA838, Código: 10791. Empaque: 1 PZA, Peso: 10.433KG, CBM: 0.029. Stock disponible: 1 PZA."
  },
  {
    "id": "nuevo_10688",
    "name": "NYLON 210D-12 COLORES MEGAPRO",
    "price": 0.96,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-NYC120",
    "specs": {
      "CÓDIGO": "10688",
      "MODELO": "MP-NYC120",
      "EMPAQUE": "80 ROLL",
      "PESO": "21.079KG",
      "PIE/CUB": "2.0068",
      "CBM": "0.057",
      "INVENTARIO": "320 ROLL"
    },
    "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 320,
    "description": "NYLON 210D-12 COLORES MEGAPRO. Modelo: MP-NYC120, Código: 10688. Empaque: 80 ROLL, Peso: 21.079KG, CBM: 0.057. Stock disponible: 320 ROLL."
  },
  {
    "id": "nuevo_12880",
    "name": "PERNO DE BRONCE MEGAPRO",
    "price": 0.49,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-KS1501",
    "specs": {
      "CÓDIGO": "12880",
      "MODELO": "MP-KS1501",
      "EMPAQUE": "500 PZA",
      "PESO": "6.000KG",
      "PIE/CUB": "0.0000",
      "CBM": "0.010",
      "INVENTARIO": "250 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 250,
    "description": "PERNO DE BRONCE MEGAPRO. Modelo: MP-KS1501, Código: 12880. Empaque: 500 PZA, Peso: 6.000KG, CBM: 0.010. Stock disponible: 250 PZA."
  },
  {
    "id": "nuevo_11561",
    "name": "PINTURA IMPERMEABILIZANTE EPOXICA 10KG MEGAPRO",
    "price": 22.81,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-REIP10KG",
    "specs": {
      "CÓDIGO": "11561",
      "MODELO": "MP-REIP10KG",
      "EMPAQUE": "1 PZA",
      "PESO": "10.500KG",
      "PIE/CUB": "0.6696",
      "CBM": "0.020",
      "INVENTARIO": "100 PZA"
    },
    "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 100,
    "description": "PINTURA IMPERMEABILIZANTE EPOXICA 10KG MEGAPRO. Modelo: MP-REIP10KG, Código: 11561. Empaque: 1 PZA, Peso: 10.500KG, CBM: 0.020. Stock disponible: 100 PZA."
  },
  {
    "id": "nuevo_13028",
    "name": "PISTOLA ELECTRICA DE PINTAR MEGAPRO",
    "price": 14.15,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PP70022",
    "specs": {
      "CÓDIGO": "13028",
      "MODELO": "MP-PP70022",
      "EMPAQUE": "10 PZA",
      "PESO": "13.400KG",
      "PIE/CUB": "0.0000",
      "CBM": "0.110",
      "INVENTARIO": "330 PZA"
    },
    "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 330,
    "description": "PISTOLA ELECTRICA DE PINTAR MEGAPRO. Modelo: MP-PP70022, Código: 13028. Empaque: 10 PZA, Peso: 13.400KG, CBM: 0.110. Stock disponible: 330 PZA."
  },
  {
    "id": "nuevo_12956",
    "name": "PISTOLA PARA HIDROJET MEGAPRO",
    "price": 1.89,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PPH2020",
    "specs": {
      "CÓDIGO": "12956",
      "MODELO": "MP-PPH2020",
      "EMPAQUE": "60 PZA",
      "PESO": "15.900KG",
      "PIE/CUB": "0.0000",
      "CBM": "0.073",
      "INVENTARIO": "1140 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1140,
    "description": "PISTOLA PARA HIDROJET MEGAPRO. Modelo: MP-PPH2020, Código: 12956. Empaque: 60 PZA, Peso: 15.900KG, CBM: 0.073. Stock disponible: 1140 PZA."
  },
  {
    "id": "nuevo_10915",
    "name": "PISTOLA PARA PINTAR MEGAPRO",
    "price": 15.42,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PEPP186",
    "specs": {
      "CÓDIGO": "10915",
      "MODELO": "MP-PEPP186",
      "EMPAQUE": "6 PZA",
      "PESO": "12.000KG",
      "PIE/CUB": "2.5284",
      "CBM": "0.072",
      "INVENTARIO": "1142 PZA"
    },
    "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1142,
    "description": "PISTOLA PARA PINTAR MEGAPRO. Modelo: MP-PEPP186, Código: 10915. Empaque: 6 PZA, Peso: 12.000KG, CBM: 0.072. Stock disponible: 1142 PZA."
  },
  {
    "id": "nuevo_11946",
    "name": "PRENSA HIDRAULICA 12 TON MEGAPRO",
    "price": 91.12,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PHWBJ-12T",
    "specs": {
      "CÓDIGO": "11946",
      "MODELO": "MP-PHWBJ-12T",
      "EMPAQUE": "1 PZA",
      "PESO": "41.000KG",
      "PIE/CUB": "1.5240",
      "CBM": "0.043",
      "INVENTARIO": "13 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 13,
    "description": "PRENSA HIDRAULICA 12 TON MEGAPRO. Modelo: MP-PHWBJ-12T, Código: 11946. Empaque: 1 PZA, Peso: 41.000KG, CBM: 0.043. Stock disponible: 13 PZA."
  },
  {
    "id": "nuevo_13029",
    "name": "PROBADOR DE CORRIENTE MEGAPRO",
    "price": 1.06,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-TBE3E1",
    "specs": {
      "CÓDIGO": "13029",
      "MODELO": "MP-TBE3E1",
      "EMPAQUE": "120 PZA",
      "PESO": "9.600KG",
      "PIE/CUB": "0.0000",
      "CBM": "0.070",
      "INVENTARIO": "3600 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 3600,
    "description": "PROBADOR DE CORRIENTE MEGAPRO. Modelo: MP-TBE3E1, Código: 13029. Empaque: 120 PZA, Peso: 9.600KG, CBM: 0.070. Stock disponible: 3600 PZA."
  },
  {
    "id": "nuevo_10233",
    "name": "PROTECTOR DE VOLTAJE 220 VOLT MEGAPRO",
    "price": 3.82,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PVPLU220",
    "specs": {
      "CÓDIGO": "10233",
      "MODELO": "MP-PVPLU220",
      "EMPAQUE": "100 PZA",
      "PESO": "20.000KG",
      "PIE/CUB": "4.2992",
      "CBM": "0.122",
      "INVENTARIO": "2 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 2,
    "description": "PROTECTOR DE VOLTAJE 220 VOLT MEGAPRO. Modelo: MP-PVPLU220, Código: 10233. Empaque: 100 PZA, Peso: 20.000KG, CBM: 0.122. Stock disponible: 2 PZA."
  },
  {
    "id": "nuevo_10054",
    "name": "PROTECTOR DE VOLTAJE REFRIGERADORES MEGAPRO",
    "price": 2.77,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-PVPRO120",
    "specs": {
      "CÓDIGO": "10054",
      "MODELO": "MP-PVPRO120",
      "EMPAQUE": "100 PZA",
      "PESO": "13.000KG",
      "PIE/CUB": "3.8723",
      "CBM": "0.110",
      "INVENTARIO": "2200 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 2200,
    "description": "PROTECTOR DE VOLTAJE REFRIGERADORES MEGAPRO. Modelo: MP-PVPRO120, Código: 10054. Empaque: 100 PZA, Peso: 13.000KG, CBM: 0.110. Stock disponible: 2200 PZA."
  },
  {
    "id": "nuevo_10321",
    "name": "REGLETA ELECTRICA MEGAPRO",
    "price": 1.26,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-HTR513",
    "specs": {
      "CÓDIGO": "10321",
      "MODELO": "MP-HTR513",
      "EMPAQUE": "48 PZA",
      "PESO": "12.000KG",
      "PIE/CUB": "1.1204",
      "CBM": "0.032",
      "INVENTARIO": "480 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 480,
    "description": "REGLETA ELECTRICA MEGAPRO. Modelo: MP-HTR513, Código: 10321. Empaque: 48 PZA, Peso: 12.000KG, CBM: 0.032. Stock disponible: 480 PZA."
  },
  {
    "id": "nuevo_10303",
    "name": "REGULADOR DE ROSCA MEGAPRO",
    "price": 1.39,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-RG-01",
    "specs": {
      "CÓDIGO": "10303",
      "MODELO": "MP-RG-01",
      "EMPAQUE": "50 PZA",
      "PESO": "10.500KG",
      "PIE/CUB": "1.6805",
      "CBM": "0.048",
      "INVENTARIO": "2350 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 2350,
    "description": "REGULADOR DE ROSCA MEGAPRO. Modelo: MP-RG-01, Código: 10303. Empaque: 50 PZA, Peso: 10.500KG, CBM: 0.048. Stock disponible: 2350 PZA."
  },
  {
    "id": "nuevo_10137",
    "name": "REPUESTO PARA RODILLO 9 PULG. MEGAPRO",
    "price": 0.46,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-RPWP743",
    "specs": {
      "CÓDIGO": "10137",
      "MODELO": "MP-RPWP743",
      "EMPAQUE": "100 PZA",
      "PESO": "5.800KG",
      "PIE/CUB": "2.6054",
      "CBM": "0.074",
      "INVENTARIO": "4600 PZA"
    },
    "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 4600,
    "description": "REPUESTO PARA RODILLO 9 PULG. MEGAPRO. Modelo: MP-RPWP743, Código: 10137. Empaque: 100 PZA, Peso: 5.800KG, CBM: 0.074. Stock disponible: 4600 PZA."
  },
  {
    "id": "nuevo_10736",
    "name": "REPUESTO PARA ROLDANA 50MM MEGAPRO",
    "price": 0.74,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-5017MMXRP",
    "specs": {
      "CÓDIGO": "10736",
      "MODELO": "MP-5017MMXRP",
      "EMPAQUE": "100 PZA",
      "PESO": "19.800KG",
      "PIE/CUB": "0.3461",
      "CBM": "0.010",
      "INVENTARIO": "100 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 100,
    "description": "REPUESTO PARA ROLDANA 50MM MEGAPRO. Modelo: MP-5017MMXRP, Código: 10736. Empaque: 100 PZA, Peso: 19.800KG, CBM: 0.010. Stock disponible: 100 PZA."
  },
  {
    "id": "nuevo_12131",
    "name": "ROLINERA R6202 MEGAPRO",
    "price": 0.37,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-R6202",
    "specs": {
      "CÓDIGO": "12131",
      "MODELO": "MP-R6202",
      "EMPAQUE": "400 PZA",
      "PESO": "17.800KG",
      "PIE/CUB": "0.3140",
      "CBM": "0.009",
      "INVENTARIO": "4400 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 4400,
    "description": "ROLINERA R6202 MEGAPRO. Modelo: MP-R6202, Código: 12131. Empaque: 400 PZA, Peso: 17.800KG, CBM: 0.009. Stock disponible: 4400 PZA."
  },
  {
    "id": "nuevo_12130",
    "name": "ROLINERA 6201 MEGAPRO",
    "price": 0.34,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-R6201",
    "specs": {
      "CÓDIGO": "12130",
      "MODELO": "MP-R6201",
      "EMPAQUE": "500 PZA",
      "PESO": "17.900KG",
      "PIE/CUB": "0.3140",
      "CBM": "0.009",
      "INVENTARIO": "3500 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 3500,
    "description": "ROLINERA 6201 MEGAPRO. Modelo: MP-R6201, Código: 12130. Empaque: 500 PZA, Peso: 17.900KG, CBM: 0.009. Stock disponible: 3500 PZA."
  },
  {
    "id": "nuevo_10950",
    "name": "ROLLO MANTO PARA IMPERMEABILIZAR MEGAPRO",
    "price": 39.97,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-CMB1M10M",
    "specs": {
      "CÓDIGO": "10950",
      "MODELO": "MP-CMB1M10M",
      "EMPAQUE": "1 PZA",
      "PESO": "18.000KG",
      "PIE/CUB": "0.8581",
      "CBM": "0.024",
      "INVENTARIO": "40 PZA"
    },
    "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 40,
    "description": "ROLLO MANTO PARA IMPERMEABILIZAR MEGAPRO. Modelo: MP-CMB1M10M, Código: 10950. Empaque: 1 PZA, Peso: 18.000KG, CBM: 0.024. Stock disponible: 40 PZA."
  },
  {
    "id": "nuevo_12919",
    "name": "RUEDA DE AIRE 10 PULG MEGAPRO",
    "price": 3.29,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-NA10PL",
    "specs": {
      "CÓDIGO": "12919",
      "MODELO": "MP-NA10PL",
      "EMPAQUE": "10 PZA",
      "PESO": "26.500KG",
      "PIE/CUB": "0.0000",
      "CBM": "0.036",
      "INVENTARIO": "230 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 230,
    "description": "RUEDA DE AIRE 10 PULG MEGAPRO. Modelo: MP-NA10PL, Código: 12919. Empaque: 10 PZA, Peso: 26.500KG, CBM: 0.036. Stock disponible: 230 PZA."
  },
  {
    "id": "nuevo_10246",
    "name": "RUEDA GIRATORIA 2 PULGADA MEGAPRO",
    "price": 0.48,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-RSF28640",
    "specs": {
      "CÓDIGO": "10246",
      "MODELO": "MP-RSF28640",
      "EMPAQUE": "150 PZA",
      "PESO": "28.800KG",
      "PIE/CUB": "1.0798",
      "CBM": "0.031",
      "INVENTARIO": "1952 PZA"
    },
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 1952,
    "description": "RUEDA GIRATORIA 2 PULGADA MEGAPRO. Modelo: MP-RSF28640, Código: 10246. Empaque: 150 PZA, Peso: 28.800KG, CBM: 0.031. Stock disponible: 1952 PZA."
  },
  {
    "id": "nuevo_10457",
    "name": "SET DE REPUESTO DE RODILLO X 3 MEGAPRO",
    "price": 1.28,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-RPWP748",
    "specs": {
      "CÓDIGO": "10457",
      "MODELO": "MP-RPWP748",
      "EMPAQUE": "40 BAG",
      "PESO": "7.300KG",
      "PIE/CUB": "3.1444",
      "CBM": "0.089",
      "INVENTARIO": "200 BAG"
    },
    "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 200,
    "description": "SET DE REPUESTO DE RODILLO X 3 MEGAPRO. Modelo: MP-RPWP748, Código: 10457. Empaque: 40 BAG, Peso: 7.300KG, CBM: 0.089. Stock disponible: 200 BAG."
  },
  {
    "id": "nuevo_12647",
    "name": "SIERRA CALADORA 400 WATT MEGAPRO",
    "price": 12.00,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-SC40W",
    "specs": {
      "CÓDIGO": "12647",
      "MODELO": "MP-SC40W",
      "EMPAQUE": "10 PZA",
      "PESO": "16.440KG",
      "PIE/CUB": "1.5044",
      "CBM": "0.043",
      "INVENTARIO": "230 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 230,
    "description": "SIERRA CALADORA 400 WATT MEGAPRO. Modelo: MP-SC40W, Código: 12647. Empaque: 10 PZA, Peso: 16.440KG, CBM: 0.043. Stock disponible: 230 PZA."
  },
  {
    "id": "nuevo_12636",
    "name": "TALADRO CON ACCESORIOS 1/2 PULG MEGAPRO",
    "price": 39.00,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-KT425",
    "specs": {
      "CÓDIGO": "12636",
      "MODELO": "MP-KT425",
      "EMPAQUE": "5 PZA",
      "PESO": "16.880KG",
      "PIE/CUB": "1.9600",
      "CBM": "0.056",
      "INVENTARIO": "25 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 25,
    "description": "TALADRO CON ACCESORIOS 1/2 PULG MEGAPRO. Modelo: MP-KT425, Código: 12636. Empaque: 5 PZA, Peso: 16.880KG, CBM: 0.056. Stock disponible: 25 PZA."
  },
  {
    "id": "nuevo_12635",
    "name": "TALADRO CON ACCESORIOS 3/8 PULG MEGAPRO",
    "price": 20.50,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-KT325",
    "specs": {
      "CÓDIGO": "12635",
      "MODELO": "MP-KT325",
      "EMPAQUE": "5 PZA",
      "PESO": "13.590KG",
      "PIE/CUB": "1.9564",
      "CBM": "0.055",
      "INVENTARIO": "205 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 205,
    "description": "TALADRO CON ACCESORIOS 3/8 PULG MEGAPRO. Modelo: MP-KT325, Código: 12635. Empaque: 5 PZA, Peso: 13.590KG, CBM: 0.055. Stock disponible: 205 PZA."
  },
  {
    "id": "nuevo_12913",
    "name": "TAPE DE EMBALAR 200YDS MEGAPRO",
    "price": 0.77,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-200YDS",
    "specs": {
      "CÓDIGO": "12913",
      "MODELO": "MP-200YDS",
      "EMPAQUE": "48 PZA",
      "PESO": "15.000KG",
      "PIE/CUB": "0.0000",
      "CBM": "0.040",
      "INVENTARIO": "4080 PZA"
    },
    "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 4080,
    "description": "TAPE DE EMBALAR 200YDS MEGAPRO. Modelo: MP-200YDS, Código: 12913. Empaque: 48 PZA, Peso: 15.000KG, CBM: 0.040. Stock disponible: 4080 PZA."
  },
  {
    "id": "nuevo_10511",
    "name": "TOMA CORRIENTE DE EMPOTRAR EN CAJA MEGAPRO",
    "price": 0.16,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MGU245-1",
    "specs": {
      "CÓDIGO": "10511",
      "MODELO": "MP-MGU245-1",
      "EMPAQUE": "200 PZA",
      "PESO": "7.600KG",
      "PIE/CUB": "0.8810",
      "CBM": "0.025",
      "INVENTARIO": "28800 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 28800,
    "description": "TOMA CORRIENTE DE EMPOTRAR EN CAJA MEGAPRO. Modelo: MP-MGU245-1, Código: 10511. Empaque: 200 PZA, Peso: 7.600KG, CBM: 0.025. Stock disponible: 28800 PZA."
  },
  {
    "id": "nuevo_11751",
    "name": "TOMA CORRIENTE DOBLE DE LUJO BLANCO MEGAPRO",
    "price": 0.64,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-MGP367",
    "specs": {
      "CÓDIGO": "11751",
      "MODELO": "MP-MGP367",
      "EMPAQUE": "120 PZA",
      "PESO": "14.350KG",
      "PIE/CUB": "1.7919",
      "CBM": "0.051",
      "INVENTARIO": "600 PZA"
    },
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 600,
    "description": "TOMA CORRIENTE DOBLE DE LUJO BLANCO MEGAPRO. Modelo: MP-MGP367, Código: 11751. Empaque: 120 PZA, Peso: 14.350KG, CBM: 0.051. Stock disponible: 600 PZA."
  },
  {
    "id": "nuevo_12648",
    "name": "SIERRA CIRCULAR 1200 WATT MEGAPRO",
    "price": 30.00,
    "category": "1",
    "section": "nuevo",
    "brand": "MEGAPRO",
    "sku": "MP-SCI12",
    "specs": {
      "CÓDIGO": "12648",
      "MODELO": "MP-SCI12",
      "EMPAQUE": "4 PZA",
      "PESO": "17.530KG",
      "PIE/CUB": "2.7027",
      "CBM": "0.077",
      "INVENTARIO": "152 PZA"
    },
    "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "favorite": False,
    "stock": 152,
    "description": "SIERRA CIRCULAR 1200 WATT MEGAPRO. Modelo: MP-SCI12, Código: 12648. Empaque: 4 PZA, Peso: 17.530KG, CBM: 0.077. Stock disponible: 152 PZA."
  }
]

# Read current nuevoCatalog.ts
with open('src/data/nuevoCatalog.ts', 'r', encoding='utf-8') as f:
    orig = f.read()

existing_ids = re.findall(r'id:\s*"([^"]+)"', orig)
print(f"Found {len(existing_ids)} existing items in nuevoCatalog.ts")

trimmed_orig = orig.strip()
if trimmed_orig.endswith('];'):
    trimmed_orig = trimmed_orig[:-2].rstrip()

new_products_code = ""
added_count = 0
for item in items:
    if item['id'] in existing_ids:
        print(f"Skipping duplicate id: {item['id']}")
        continue
    specs_str = ",\n".join([f'      "{k}": {json.dumps(v, ensure_ascii=False)}' for k, v in item['specs'].items()])
    block = f"""  {{
    id: {json.dumps(item['id'])},
    name: {json.dumps(item['name'], ensure_ascii=False)},
    price: {item['price']},
    category: {json.dumps(item['category'])},
    section: {json.dumps(item['section'])},
    brand: {json.dumps(item['brand'], ensure_ascii=False)},
    sku: {json.dumps(item['sku'])},
    specs: {{
{specs_str}
    }},
    image: {json.dumps(item['image'])},
    favorite: false,
    stock: {item['stock']},
    description: {json.dumps(item['description'], ensure_ascii=False)}
  }}"""
    new_products_code += ",\n" + block
    added_count += 1

final_file = trimmed_orig + new_products_code + "\n];\n"

with open('src/data/nuevoCatalog.ts', 'w', encoding='utf-8') as f:
    f.write(final_file)

print(f"Successfully added {added_count} products to nuevoCatalog.ts!")
