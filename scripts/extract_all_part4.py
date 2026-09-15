import json
import re

# Let's define the products from pages 76 to 82:
products_p76_82 = [
    # PAGE 76
    {
        "name": "SET DE SACA BUJIAS MEGAPRO",
        "code": "10304",
        "sku": "MP-FRTP4",
        "empaque": "30",
        "pie_cub": "1.0086",
        "peso": "21.493KG",
        "cbm": "0.029",
        "price": 3.76,
        "stock": 1320,
        "unit": "PZA"
    },
    {
        "name": "SIERRA CALADORA 400 WATT MEGAPRO",
        "code": "12647",
        "sku": "MP-SC40W",
        "empaque": "10",
        "pie_cub": "1.5044",
        "peso": "16.440KG",
        "cbm": "0.043",
        "price": 12.00,
        "stock": 230,
        "unit": "PZA"
    },
    {
        "name": "SIERRA CIRCULAR 1200 WATT MEGAPRO",
        "code": "12648",
        "sku": "MP-SCI12",
        "empaque": "4",
        "pie_cub": "2.7027",
        "peso": "17.530KG",
        "cbm": "0.077",
        "price": 30.00,
        "stock": 152,
        "unit": "PZA"
    },
    {
        "name": "SILICON BLANCO 300 ML MEGAPRO",
        "code": "10594",
        "sku": "MP-PVWHITE03",
        "empaque": "24",
        "pie_cub": "0.5340",
        "peso": "7.800KG",
        "cbm": "0.015",
        "price": 1.38,
        "stock": 842,
        "unit": "PZA"
    },
    {
        "name": "SILICON TRANSPARENTE 300 ML MEGAPRO",
        "code": "10593",
        "sku": "MP-PVTRL03",
        "empaque": "24",
        "pie_cub": "0.5340",
        "peso": "7.800KG",
        "cbm": "0.015",
        "price": 1.38,
        "stock": 384,
        "unit": "PZA"
    },
    {
        "name": "SOPLADOR 710 WATT MEGAPRO",
        "code": "12646",
        "sku": "MP-S710W",
        "empaque": "4",
        "pie_cub": "1.5425",
        "peso": "8.160KG",
        "cbm": "0.044",
        "price": 16.00,
        "stock": 220,
        "unit": "PZA"
    },
    {
        "name": "TABLERO ELECTRICO 12 TACO CON PUERTA MEGAPRO",
        "code": "10580",
        "sku": "MP-BB009",
        "empaque": "10",
        "pie_cub": "3.1289",
        "peso": "20.400KG",
        "cbm": "0.089",
        "price": 11.75,
        "stock": 432,
        "unit": "PZA"
    },
    {
        "name": "TABLERO ELECTRICO 12 TACO MEGAPRO",
        "code": "10576",
        "sku": "MP-BB005",
        "empaque": "10",
        "pie_cub": "2.3555",
        "peso": "14.950KG",
        "cbm": "0.067",
        "price": 8.42,
        "stock": 350,
        "unit": "PZA"
    },
    {
        "name": "TABLERO ELECTRICO 2 TACO MEGAPRO",
        "code": "10572",
        "sku": "MP-BB001",
        "empaque": "20",
        "pie_cub": "1.7410",
        "peso": "9.550KG",
        "cbm": "0.049",
        "price": 2.02,
        "stock": 762,
        "unit": "PZA"
    },

    # PAGE 77
    {
        "name": "TABLERO ELECTRICO 4 TACO CON PUERTA MEGAPRO",
        "code": "10577",
        "sku": "MP-BB006",
        "empaque": "20",
        "pie_cub": "3.0936",
        "peso": "20.550KG",
        "cbm": "0.088",
        "price": 5.41,
        "stock": 262,
        "unit": "PZA"
    },
    {
        "name": "TABLERO ELECTRICO 4 TACO MEGAPRO",
        "code": "10573",
        "sku": "MP-BB002",
        "empaque": "20",
        "pie_cub": "2.4014",
        "peso": "14.600KG",
        "cbm": "0.068",
        "price": 3.62,
        "stock": 762,
        "unit": "PZA"
    },
    {
        "name": "TABLERO ELECTRICO 6 TACO CON PUERTA MEGAPRO",
        "code": "10578",
        "sku": "MP-BB007",
        "empaque": "20",
        "pie_cub": "3.7822",
        "peso": "23.200KG",
        "cbm": "0.107",
        "price": 6.74,
        "stock": 80,
        "unit": "PZA"
    },
    {
        "name": "TABLERO ELECTRICO 6 TACO MEGAPRO",
        "code": "10574",
        "sku": "MP-BB003",
        "empaque": "20",
        "pie_cub": "2.9064",
        "peso": "20.250KG",
        "cbm": "0.082",
        "price": 4.50,
        "stock": 1062,
        "unit": "PZA"
    },
    {
        "name": "TABLERO ELECTRICO 8 TACO CON PUERTA MEGAPRO",
        "code": "10579",
        "sku": "MP-BB008",
        "empaque": "10",
        "pie_cub": "2.3308",
        "peso": "15.100KG",
        "cbm": "0.066",
        "price": 8.20,
        "stock": 82,
        "unit": "PZA"
    },
    {
        "name": "TABLERO ELECTRICO 8 TACO MEGAPRO",
        "code": "10575",
        "sku": "MP-BB004",
        "empaque": "10",
        "pie_cub": "1.7304",
        "peso": "12.200KG",
        "cbm": "0.049",
        "price": 5.44,
        "stock": 532,
        "unit": "PZA"
    },
    {
        "name": "TALADRO 500 WATT 1/2 PULG MEGAPRO",
        "code": "12641",
        "sku": "MP-TI50W",
        "empaque": "10",
        "pie_cub": "1.8858",
        "peso": "18.290KG",
        "cbm": "0.053",
        "price": 12.50,
        "stock": 750,
        "unit": "PZA"
    },
    {
        "name": "TALADRO CON ACCESORIOS 1/2 PULG MEGAPRO",
        "code": "12636",
        "sku": "MP-KT425",
        "empaque": "5",
        "pie_cub": "1.9600",
        "peso": "16.880KG",
        "cbm": "0.056",
        "price": 39.00,
        "stock": 25,
        "unit": "PZA"
    },
    {
        "name": "TALADRO CON ACCESORIOS 3/8 PULG MEGAPRO",
        "code": "12635",
        "sku": "MP-KT325",
        "empaque": "5",
        "pie_cub": "1.9564",
        "peso": "13.590KG",
        "cbm": "0.055",
        "price": 20.50,
        "stock": 205,
        "unit": "PZA"
    },

    # PAGE 78
    {
        "name": "TAPA CIEGA COMPLETA IVORY MEGAPRO",
        "code": "13003",
        "sku": "MP-TCSP10",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "10.800KG",
        "cbm": "0.083",
        "price": 0.25,
        "stock": 1000,
        "unit": "PZA"
    },
    {
        "name": "TAPA PARA TOMA CORRIENTE DOBLE MEGAPRO",
        "code": "11755",
        "sku": "MP-MGP344",
        "empaque": "200",
        "pie_cub": "3.0328",
        "peso": "14.910KG",
        "cbm": "0.086",
        "price": 0.09,
        "stock": 24400,
        "unit": "PZA"
    },
    {
        "name": "TAPE DE EMBALAR 200YDS MEGAPRO",
        "code": "12913",
        "sku": "MP-200YDS",
        "empaque": "48",
        "pie_cub": "0.0000",
        "peso": "15.000KG",
        "cbm": "0.040",
        "price": 0.77,
        "stock": 4080,
        "unit": "PZA"
    },
    {
        "name": "TAPE DE EMBALAR 300YDS MEGAPRO",
        "code": "12914",
        "sku": "MP-300YDS",
        "empaque": "24",
        "pie_cub": "0.0000",
        "peso": "13.000KG",
        "cbm": "0.030",
        "price": 1.27,
        "stock": 3240,
        "unit": "PZA"
    },
    {
        "name": "TAPE DE EMBALAR 60YDS MEGAPRO",
        "code": "12912",
        "sku": "MP-60YDS",
        "empaque": "144",
        "pie_cub": "0.0000",
        "peso": "14.000KG",
        "cbm": "0.070",
        "price": 0.26,
        "stock": 19152,
        "unit": "PZA"
    },
    {
        "name": "TOLDO MEGAPRO",
        "code": "11535",
        "sku": "MP-NY90-1",
        "empaque": "1",
        "pie_cub": "1.5003",
        "peso": "15.000KG",
        "cbm": "0.043",
        "price": 46.07,
        "stock": 40,
        "unit": "ROLL"
    },

    # PAGE 79
    {
        "name": "TOMA CORRIENTE 20 AMP MEGAPRO",
        "code": "13014",
        "sku": "MP-T2VUSE",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "12.370KG",
        "cbm": "0.044",
        "price": 0.50,
        "stock": 1000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE 220 VOLT MEGAPRO",
        "code": "10815",
        "sku": "MP-DTCEYH1",
        "empaque": "200",
        "pie_cub": "2.9118",
        "peso": "22.080KG",
        "cbm": "0.083",
        "price": 0.70,
        "stock": 1200,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE 220 VOLT PLATEADO MEGAPRO",
        "code": "10539",
        "sku": "MP-DTCHY220",
        "empaque": "200",
        "pie_cub": "2.9118",
        "peso": "24.640KG",
        "cbm": "0.083",
        "price": 0.69,
        "stock": 3,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DE EMPOTRAR EN BOLSA MEGAPRO",
        "code": "10510",
        "sku": "MP-MGU245",
        "empaque": "200",
        "pie_cub": "1.5643",
        "peso": "8.060KG",
        "cbm": "0.044",
        "price": 0.21,
        "stock": 25400,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DE EMPOTRAR EN CAJA MEGAPRO",
        "code": "10511",
        "sku": "MP-MGU245-1",
        "empaque": "200",
        "pie_cub": "0.8810",
        "peso": "7.600KG",
        "cbm": "0.025",
        "price": 0.16,
        "stock": 28800,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE GRIS MEGAPRO",
        "code": "13002",
        "sku": "MP-G1TCD1",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "21.050KG",
        "cbm": "0.083",
        "price": 0.82,
        "stock": 2000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE BLANCO MEGAPRO",
        "code": "12997",
        "sku": "MP-TDZKA2",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "21.240KG",
        "cbm": "0.083",
        "price": 0.73,
        "stock": 2000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE DE LUJO BLANCO MEGAPRO",
        "code": "11751",
        "sku": "MP-MGP367",
        "empaque": "120",
        "pie_cub": "1.7919",
        "peso": "14.350KG",
        "cbm": "0.051",
        "price": 0.64,
        "stock": 600,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE GOLD MEGAPRO",
        "code": "10532",
        "sku": "MP-DTC2-MA",
        "empaque": "200",
        "pie_cub": "2.9118",
        "peso": "24.290KG",
        "cbm": "0.083",
        "price": 0.85,
        "stock": 3,
        "unit": "PZA"
    },

    # PAGE 80
    {
        "name": "TOMA CORRIENTE DOBLE IVORY MEGAPRO",
        "code": "12989",
        "sku": "MP-A616TD",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "17.010KG",
        "cbm": "0.072",
        "price": 0.48,
        "stock": 1000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE IVORY MEGAPRO",
        "code": "12990",
        "sku": "MP-A6TCSD",
        "empaque": "160",
        "pie_cub": "0.0000",
        "peso": "12.730KG",
        "cbm": "0.044",
        "price": 0.42,
        "stock": 960,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE IVORY MEGAPRO",
        "code": "12984",
        "sku": "MP-LATCD1",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "15.910KG",
        "cbm": "0.083",
        "price": 0.54,
        "stock": 2000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE MEGAPRO",
        "code": "10816",
        "sku": "MP-DTC2-G",
        "empaque": "200",
        "pie_cub": "2.9118",
        "peso": "24.190KG",
        "cbm": "0.083",
        "price": 0.78,
        "stock": 200,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE MEGAPRO",
        "code": "11728",
        "sku": "MP-MGP355",
        "empaque": "120",
        "pie_cub": "2.3144",
        "peso": "13.710KG",
        "cbm": "0.066",
        "price": 0.39,
        "stock": 3280,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE MEGAPRO",
        "code": "10823",
        "sku": "MP-TOM313",
        "empaque": "200",
        "pie_cub": "2.9118",
        "peso": "25.110KG",
        "cbm": "0.083",
        "price": 0.70,
        "stock": 3,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE NEGRO MEGAPRO",
        "code": "10526",
        "sku": "MP-DTC2",
        "empaque": "200",
        "pie_cub": "2.9118",
        "peso": "26.970KG",
        "cbm": "0.083",
        "price": 0.86,
        "stock": 3,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE DOBLE SUPERFICIAL MEGAPRO",
        "code": "13013",
        "sku": "MP-U0TD2S",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "13.210KG",
        "cbm": "0.044",
        "price": 0.33,
        "stock": 2000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE SENCILLO 110 VOLT MEGAPRO",
        "code": "11729",
        "sku": "MP-MGP357",
        "empaque": "200",
        "pie_cub": "2.3144",
        "peso": "13.290KG",
        "cbm": "0.066",
        "price": 0.41,
        "stock": 1600,
        "unit": "PZA"
    },

    # PAGE 81
    {
        "name": "TOMA CORRIENTE SENCILLO 220 VOLT MEGAPRO",
        "code": "11730",
        "sku": "MP-MGP393",
        "empaque": "300",
        "pie_cub": "2.3144",
        "peso": "13.180KG",
        "cbm": "0.070",
        "price": 0.36,
        "stock": 100,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE SENCILLO BLANCO MEGAPRO",
        "code": "12996",
        "sku": "MP-ZKATCS",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "17.770KG",
        "cbm": "0.083",
        "price": 0.50,
        "stock": 1000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE SENCILLO IVORY MEGAPRO",
        "code": "12987",
        "sku": "MP-TCA6S1",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "14.080KG",
        "cbm": "0.072",
        "price": 0.37,
        "stock": 1000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE SENCILLO MEGAPRO",
        "code": "13016",
        "sku": "MP-U12VTS",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "10.210KG",
        "cbm": "0.044",
        "price": 0.36,
        "stock": 2000,
        "unit": "PZA"
    },
    {
        "name": "TOMA CORRIENTE SENCILLO MEGAPRO",
        "code": "13015",
        "sku": "MP-U13TSE",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "10.160KG",
        "cbm": "0.044",
        "price": 0.36,
        "stock": 4000,
        "unit": "PZA"
    },
    {
        "name": "TOMA DE EMPOTRAR TRIFASICO MEGAPRO",
        "code": "10514",
        "sku": "MP-TTRIE-01-50A",
        "empaque": "120",
        "pie_cub": "1.6035",
        "peso": "14.560KG",
        "cbm": "0.045",
        "price": 1.22,
        "stock": 3120,
        "unit": "PZA"
    },
    {
        "name": "TOMA DE SOBREPONER TRIFASICO MEGAPRO",
        "code": "10515",
        "sku": "MP-TTRIS02-50A",
        "empaque": "60",
        "pie_cub": "1.2639",
        "peso": "19.780KG",
        "cbm": "0.036",
        "price": 1.74,
        "stock": 1560,
        "unit": "PZA"
    },
    {
        "name": "TOMA SENCILLO GRIS MEGAPRO",
        "code": "13001",
        "sku": "MP-211TCS",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "17.770KG",
        "cbm": "0.083",
        "price": 0.60,
        "stock": 1000,
        "unit": "PZA"
    },
    {
        "name": "TOMO CORRIENTE DOBLE IVORY MEGAPRO",
        "code": "13007",
        "sku": "MP-B11TCD",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "16.750KG",
        "cbm": "0.083",
        "price": 0.57,
        "stock": 2000,
        "unit": "PZA"
    },

    # PAGE 82
    {
        "name": "TRANSPALET 3 TONELADAS MEGAPRO",
        "code": "11477",
        "sku": "MP-MHF300K",
        "empaque": "6",
        "pie_cub": "31.6773",
        "peso": "410.000KG",
        "cbm": "0.897",
        "price": 113.16,
        "stock": 6,
        "unit": "PZA"
    },
    {
        "name": "TUBERIA CINDUIT 1/2 PULGADA 3 METROS MEGAPRO",
        "code": "11063",
        "sku": "MP-TDC1214",
        "empaque": "30",
        "pie_cub": "1.5068",
        "peso": "12.690KG",
        "cbm": "0.043",
        "price": 0.87,
        "stock": 6300,
        "unit": "PZA"
    },
    {
        "name": "TUBERIA CINDUIT 3/4 PULGADA 3 METROS MEGAPRO",
        "code": "11064",
        "sku": "MP-TDC3416",
        "empaque": "20",
        "pie_cub": "1.6139",
        "peso": "12.120KG",
        "cbm": "0.046",
        "price": 1.28,
        "stock": 1620,
        "unit": "PZA"
    },
    {
        "name": "TUBERIA CONDUIT 1.1/2 PULGADA 3 METROS MEGAPRO",
        "code": "11066",
        "sku": "MP-TDC1122",
        "empaque": "6",
        "pie_cub": "1.8364",
        "peso": "8.802KG",
        "cbm": "0.052",
        "price": 2.85,
        "stock": 6,
        "unit": "PZA"
    },
    {
        "name": "VIDRIO PARA CARETA TRANSPARENTE MEGAPRO",
        "code": "10628",
        "sku": "PC LENS",
        "empaque": "5,000",
        "pie_cub": "0.3531",
        "peso": "19.500KG",
        "cbm": "0.010",
        "price": 0.12,
        "stock": 100,
        "unit": "PZA"
    }
]

print(f"Total Part 4 products defined: {len(products_p76_82)}")

def assign_category(name, sku):
    name_upper = name.upper()
    sku_upper = sku.upper()
    
    if any(k in name_upper for k in ['TABLERO', 'TOMA', 'TAPA CIEGA', 'PLAFON', 'MEDIDOR', 'REGLETA', 'PROTECTOR DE VOLTAJE']):
        return "Electricidad y Tableros"
    elif any(k in name_upper for k in ['TALADRO', 'SIERRA', 'SOPLADOR', 'LIJADORA', 'PULIDORA', 'PISTOLA DE CALOR', 'MAQUINA DE SOLDAR', 'PISTOLA ELECTRICA']):
        return "Herramientas Eléctricas"
    elif any(k in name_upper for k in ['MALLA', 'ALAMBRE', 'CICLON']):
        return "Mallas y Cercas"
    elif any(k in name_upper for k in ['ROLDANA', 'POLEA', 'RUEDA', 'ROLINERA']):
        return "Ruedas, Roldanas y Rodamientos"
    elif any(k in name_upper for k in ['LLANA', 'PALUSTRA', 'RODILLO', 'REPUESTO PARA RODILLO', 'BANDEJA CON RODILLO', 'BROCHA']):
        return "Albañilería y Pintura"
    elif any(k in name_upper for k in ['MECATE', 'NYLON', 'TAPE', 'MASKING', 'TOLDO']):
        return "Mecates, Cuerdas y Cintas"
    elif any(k in name_upper for k in ['PISTOLA HIDROJET', 'PISTOLA PARA HIDROJET', 'MANGUERA']):
        return "Hidrolavadoras y Mangueras"
    elif any(k in name_upper for k in ['RAMPLUG', 'PERNO', 'TORNILLO']):
        return "Fijación y Tornillería"
    elif any(k in name_upper for k in ['PRENSA', 'TRANSPALET', 'LLAVE DE IMPACTO', 'MOTOSIERRA']):
        return "Maquinaria y Carga Pesada"
    elif any(k in name_upper for k in ['SILICON', 'PEGAMENTO', 'PINTURA IMPERMEABILIZANTE']):
        return "Químicos, Selladores y Adhesivos"
    elif any(k in name_upper for k in ['LENTES', 'MASCARA', 'VIDRIO PARA CARETA', 'PUERTAS DE SEGURIDAD']):
        return "Seguridad Industrial y Protección"
    elif any(k in name_upper for k in ['MANILLA', 'CERRADURA']):
        return "Cerrajería y Manillas"
    elif any(k in name_upper for k in ['TUBERIA']):
        return "Tuberías y Canalización"
    elif any(k in name_upper for k in ['SET DE DESTORNILLADORES', 'SET DE BROCA', 'SET DE SACA BUJIAS', 'REMACHADORA', 'RACHE', 'PINZA', 'MARCO CON SEGUETA', 'LLAVE DE CRUZ']):
        return "Herramientas Manuales"
    else:
        return "Ferretería General"

def get_image_placeholder(category, name):
    name_l = name.lower()
    if 'taladro' in name_l:
        return "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    elif 'sierra' in name_l:
        return "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
    elif 'soplador' in name_l:
        return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
    elif 'toma' in name_l or 'tablero' in name_l or 'tapa' in name_l:
        return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
    elif 'tape' in name_l:
        return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
    elif 'silicon' in name_l:
        return "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
    elif 'transpalet' in name_l:
        return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
    elif 'tuberia' in name_l:
        return "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80"
    else:
        return "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80"

formatted_items = []
for p in products_p76_82:
    cat = assign_category(p['name'], p['sku'])
    img = get_image_placeholder(cat, p['name'])
    
    code = p['code']
    p_id = f"megapro_{code}"
    
    empaque_clean = str(p['empaque']).replace(' PZA', '').replace(' ROLL', '').replace(' CJ', '').replace(' SET', '').replace(' PAR', '').replace(' MTR', '').replace(' METRO', '').replace(' BLISTER', '').replace(' BOT', '').strip()
    
    item = {
        "id": p_id,
        "name": p['name'],
        "price": p['price'],
        "category": cat,
        "section": "MEGAPRO",
        "brand": "MEGAPRO",
        "sku": p['sku'],
        "specs": {
            "CÓDIGO": code,
            "MODELO": p['sku'],
            "EMPAQUE": empaque_clean,
            "PESO": p['peso'],
            "PIE/CUB": p['pie_cub'],
            "CBM": p['cbm'],
            "INVENTARIO": f"{p['stock']} {p['unit']}"
        },
        "image": img,
        "favorite": False,
        "stock": p['stock'],
        "description": f"{p['name']}. Modelo: {p['sku']}, Código: {code}. Empaque: {empaque_clean}, Peso: {p['peso']}, CBM: {p['cbm']}. Stock disponible: {p['stock']} {p['unit']}."
    }
    formatted_items.append(item)

with open('scripts/part4_products.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_items, f, ensure_ascii=False, indent=2)

print("Saved scripts/part4_products.json successfully!")
