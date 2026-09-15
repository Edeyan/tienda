import json
import re

# We will define the exact parsed products for Pages 51 to 75
products_p51_75 = [
    # PAGE 51
    {
        "name": "LAMPARA REDONDA SUPERFICIAL 24 WATT MEGAPRO",
        "code": "10073",
        "sku": "MP-PLSR24",
        "empaque": "20",
        "pie_cub": "2.2333",
        "peso": "14.500KG",
        "cbm": "0.063",
        "price": 3.27,
        "stock": 1660,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA REDONDA SUPERFICIAL BORDE INFINITO 18 WATT MEGAPRO",
        "code": "10079",
        "sku": "MP-PLSR18H",
        "empaque": "60",
        "pie_cub": "1.9054",
        "peso": "9.500KG",
        "cbm": "0.054",
        "price": 1.44,
        "stock": 1,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA REDONDA SUPERFICIAL BORDE INFINITO 24 WATT MEGAPRO",
        "code": "10080",
        "sku": "MP-PLSR24H",
        "empaque": "40",
        "pie_cub": "2.2723",
        "peso": "10.000KG",
        "cbm": "0.064",
        "price": 2.13,
        "stock": 80,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL 15W DECORATIVA 260MM MEGAPRO",
        "code": "12535",
        "sku": "MP-L15WLD",
        "empaque": "10",
        "pie_cub": "2.5077",
        "peso": "4.500KG",
        "cbm": "0.070",
        "price": 3.37,
        "stock": 770,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL 15W SENSOR MOV MEGAPRO",
        "code": "11232",
        "sku": "MP-21LAMP15W",
        "empaque": "30",
        "pie_cub": "2.5956",
        "peso": "8.500KG",
        "cbm": "0.074",
        "price": 2.96,
        "stock": 810,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL 20 WATT MEGAPRO",
        "code": "11231",
        "sku": "MP-34LAMP20W",
        "empaque": "20",
        "pie_cub": "3.0488",
        "peso": "7.333KG",
        "cbm": "0.086",
        "price": 2.87,
        "stock": 940,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL 20 WATT MEGAPRO",
        "code": "11236",
        "sku": "MP-LR342520W",
        "empaque": "40",
        "pie_cub": "3.1077",
        "peso": "9.200KG",
        "cbm": "0.088",
        "price": 1.94,
        "stock": 680,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL 20W SENSOR MOV MEGAPRO",
        "code": "11233",
        "sku": "MP-21LAMP20W",
        "empaque": "20",
        "pie_cub": "3.4373",
        "peso": "8.500KG",
        "cbm": "0.097",
        "price": 4.21,
        "stock": 940,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL 25 WATT MEGAPRO",
        "code": "11227",
        "sku": "MP-LP25W25D",
        "empaque": "20",
        "pie_cub": "2.2484",
        "peso": "10.000KG",
        "cbm": "0.064",
        "price": 3.97,
        "stock": 340,
        "unit": "PZA"
    },

    # PAGE 52
    {
        "name": "LAMPARA SUPERFICIAL 25W DECORATIVA 380 MM MEGAPRO",
        "code": "12536",
        "sku": "MP-380W25",
        "empaque": "10",
        "pie_cub": "2.5077",
        "peso": "7.767KG",
        "cbm": "0.070",
        "price": 5.32,
        "stock": 250,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL 25W DECORATIVA 380 MM MEGAPRO",
        "code": "12537",
        "sku": "MP-MV25WL",
        "empaque": "10",
        "pie_cub": "5.1089",
        "peso": "8.600KG",
        "cbm": "0.140",
        "price": 6.38,
        "stock": 350,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL 25W SENSOR MOV MEGAPRO",
        "code": "11228",
        "sku": "MP-LPWRS25W25D",
        "empaque": "20",
        "pie_cub": "2.2484",
        "peso": "10.000KG",
        "cbm": "0.064",
        "price": 4.64,
        "stock": 340,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL BORDE INFINITO CUADRADA 18 WATT MEGAPRO",
        "code": "10362",
        "sku": "MP-LPSSO18W",
        "empaque": "40",
        "pie_cub": "1.4020",
        "peso": "7.400KG",
        "cbm": "0.040",
        "price": 1.39,
        "stock": 40,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL BORDE INFINITO CUADRADA 24 WATT MEGAPRO",
        "code": "10363",
        "sku": "MP-LPSSO24W",
        "empaque": "40",
        "pie_cub": "2.4720",
        "peso": "11.800KG",
        "cbm": "0.070",
        "price": 1.97,
        "stock": 640,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL BORDE INFINITO CUADRADA 36 WATT MEGAPRO",
        "code": "10364",
        "sku": "MP-LPSSO36W",
        "empaque": "20",
        "pie_cub": "2.2955",
        "peso": "9.800KG",
        "cbm": "0.065",
        "price": 3.09,
        "stock": 380,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL BORDE INFINITO REDONDA 18 WATT MEGAPRO",
        "code": "10359",
        "sku": "MP-LPRSO18W",
        "empaque": "40",
        "pie_cub": "1.3243",
        "peso": "8.800KG",
        "cbm": "0.038",
        "price": 1.33,
        "stock": 880,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL BORDE INFINITO REDONDA 24 WATT MEGAPRO",
        "code": "10360",
        "sku": "MP-LPRSO24W",
        "empaque": "40",
        "pie_cub": "1.7069",
        "peso": "10.200KG",
        "cbm": "0.048",
        "price": 1.77,
        "stock": 600,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL BORDE INFINITO REDONDA 36 WATT MEGAPRO",
        "code": "10361",
        "sku": "MP-LPRSO36W",
        "empaque": "20",
        "pie_cub": "2.7075",
        "peso": "8.200KG",
        "cbm": "0.077",
        "price": 3.00,
        "stock": 82,
        "unit": "PZA"
    },

    # PAGE 53
    {
        "name": "LAMPARA SUPERFICIAL CUADRADA 12 WATT MEGAPRO",
        "code": "10347",
        "sku": "MP-PLCI12W",
        "empaque": "40",
        "pie_cub": "1.6464",
        "peso": "13.200KG",
        "cbm": "0.047",
        "price": 1.59,
        "stock": 1520,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL CUADRADA 18 WATT MEGAPRO",
        "code": "10348",
        "sku": "MP-PLCS18W",
        "empaque": "40",
        "pie_cub": "2.6747",
        "peso": "20.700KG",
        "cbm": "0.076",
        "price": 2.10,
        "stock": 1280,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL CUADRADA 24 WATT MEGAPRO",
        "code": "10349",
        "sku": "MP-PLCI24W",
        "empaque": "20",
        "pie_cub": "2.4304",
        "peso": "17.900KG",
        "cbm": "0.069",
        "price": 3.29,
        "stock": 918,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL REDONDA 12 WATT MEGAPRO",
        "code": "12517",
        "sku": "MP-PLCIRS12W",
        "empaque": "40",
        "pie_cub": "1.6464",
        "peso": "11.000KG",
        "cbm": "0.047",
        "price": 1.63,
        "stock": 680,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL REDONDA 12 WATT MEGAPRO",
        "code": "10344",
        "sku": "MP-PLCIRS12W 12W",
        "empaque": "40",
        "pie_cub": "1.6457",
        "peso": "11.200KG",
        "cbm": "0.047",
        "price": 1.47,
        "stock": 560,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL REDONDA 18 WATT MEGAPRO",
        "code": "10357",
        "sku": "MP-LPRE18W",
        "empaque": "60",
        "pie_cub": "2.2072",
        "peso": "7.400KG",
        "cbm": "0.063",
        "price": 1.18,
        "stock": 1202,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL REDONDA 18 WATT MEGAPRO",
        "code": "12518",
        "sku": "MP-PLCIRS18W",
        "empaque": "40",
        "pie_cub": "2.6747",
        "peso": "17.400KG",
        "cbm": "0.076",
        "price": 1.96,
        "stock": 80,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL REDONDA 18 WATT MEGAPRO",
        "code": "10345",
        "sku": "MP-PLCIRS18W18W",
        "empaque": "40",
        "pie_cub": "2.6769",
        "peso": "17.200KG",
        "cbm": "0.076",
        "price": 1.82,
        "stock": 960,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL REDONDA 24 WATT MEGAPRO",
        "code": "10358",
        "sku": "MP-LPRE24W",
        "empaque": "40",
        "pie_cub": "2.0836",
        "peso": "8.077KG",
        "cbm": "0.059",
        "price": 1.60,
        "stock": 960,
        "unit": "PZA"
    },

    # PAGE 54
    {
        "name": "LAMPARA SUPERFICIAL REDONDA 24 WATT MEGAPRO",
        "code": "10346",
        "sku": "MP-PLCIRS24W",
        "empaque": "20",
        "pie_cub": "2.4296",
        "peso": "15.300KG",
        "cbm": "0.069",
        "price": 2.90,
        "stock": 1302,
        "unit": "PZA"
    },
    {
        "name": "LAMPARA SUPERFICIAL REDONDA 9 WATT MEGAPRO",
        "code": "10356",
        "sku": "MP-LPRE9W",
        "empaque": "100",
        "pie_cub": "2.1660",
        "peso": "6.667KG",
        "cbm": "0.061",
        "price": 0.93,
        "stock": 2900,
        "unit": "PZA"
    },
    {
        "name": "LENTES DE SEGURIDAD MEGAPRO",
        "code": "11520",
        "sku": "MP-3113-ASPC",
        "empaque": "300",
        "pie_cub": "3.3902",
        "peso": "9.000KG",
        "cbm": "0.096",
        "price": 0.48,
        "stock": 36,
        "unit": "PZA"
    },
    {
        "name": "LENTES DE SEGURIDAD MEGAPRO",
        "code": "11523",
        "sku": "MP-3203-ASPC",
        "empaque": "300",
        "pie_cub": "3.4354",
        "peso": "9.000KG",
        "cbm": "0.097",
        "price": 0.56,
        "stock": 300,
        "unit": "PZA"
    },
    {
        "name": "LENTES DE SEGURIDAD MEGAPRO",
        "code": "11524",
        "sku": "MP-QB1203-ASPC",
        "empaque": "300",
        "pie_cub": "4.7011",
        "peso": "10.000KG",
        "cbm": "0.133",
        "price": 0.69,
        "stock": 12,
        "unit": "PZA"
    },
    {
        "name": "LENTES DE SEGURIDAD MEGAPRO",
        "code": "11525",
        "sku": "MP-QB1209E-ASPCE",
        "empaque": "300",
        "pie_cub": "3.7530",
        "peso": "11.000KG",
        "cbm": "0.106",
        "price": 0.86,
        "stock": 300,
        "unit": "PZA"
    },
    {
        "name": "LENTES DE SEGURIDAD MEGAPRO",
        "code": "11519",
        "sku": "MP-QB1213",
        "empaque": "300",
        "pie_cub": "4.9379",
        "peso": "15.000KG",
        "cbm": "0.140",
        "price": 0.45,
        "stock": 300,
        "unit": "PZA"
    },
    {
        "name": "LIJADORA ORBITAL 280 WATT MEGAPRO",
        "code": "12640",
        "sku": "MP-LO5P",
        "empaque": "10",
        "pie_cub": "1.7869",
        "peso": "16.690KG",
        "cbm": "0.051",
        "price": 15.50,
        "stock": 280,
        "unit": "PZA"
    },
    {
        "name": "LIJADORA ORBITAL MEGAPRO",
        "code": "12391",
        "sku": "MP-PUL-OR125",
        "empaque": "10",
        "pie_cub": "2.1015",
        "peso": "14.400KG",
        "cbm": "0.060",
        "price": 18.27,
        "stock": 690,
        "unit": "PZA"
    },

    # PAGE 55
    {
        "name": "LLANA CON BASE DE GOMA MEGAPRO",
        "code": "12947",
        "sku": "MP-LE215A",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "20.000KG",
        "cbm": "0.112",
        "price": 2.05,
        "stock": 600,
        "unit": "PZA"
    },
    {
        "name": "LLANA CON ESPUMA MEGAPRO",
        "code": "11559",
        "sku": "MP-LL24A10-GG15",
        "empaque": "48",
        "pie_cub": "2.6784",
        "peso": "12.000KG",
        "cbm": "0.080",
        "price": 1.14,
        "stock": 48,
        "unit": "PZA"
    },
    {
        "name": "LLANA DE GOMA MEGAPRO",
        "code": "12941",
        "sku": "MP-L240PA",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "13.000KG",
        "cbm": "0.087",
        "price": 1.06,
        "stock": 900,
        "unit": "PZA"
    },
    {
        "name": "LLANA DENTALLA MEGAPRO",
        "code": "10083",
        "sku": "MP-RWPD02",
        "empaque": "60",
        "pie_cub": "2.8431",
        "peso": "13.200KG",
        "cbm": "0.081",
        "price": 0.93,
        "stock": 660,
        "unit": "PZA"
    },
    {
        "name": "LLANA ESPUMA 270X180 MEGAPRO",
        "code": "12944",
        "sku": "MP-L270EA",
        "empaque": "36",
        "pie_cub": "0.0000",
        "peso": "9.000KG",
        "cbm": "0.154",
        "price": 2.18,
        "stock": 540,
        "unit": "PZA"
    },
    {
        "name": "LLANA LISA MEGAPRO",
        "code": "10082",
        "sku": "MP-RWPD01",
        "empaque": "60",
        "pie_cub": "2.7851",
        "peso": "12.300KG",
        "cbm": "0.079",
        "price": 0.90,
        "stock": 1200,
        "unit": "PZA"
    },
    {
        "name": "LLANA LISA METALICA MANGO DE MADERA MEGAPRO",
        "code": "10084",
        "sku": "MP-RWPD03",
        "empaque": "60",
        "pie_cub": "2.7851",
        "peso": "17.600KG",
        "cbm": "0.079",
        "price": 1.37,
        "stock": 842,
        "unit": "PZA"
    },
    {
        "name": "LLANA PLASTICA 270 X 180 MEGAPRO",
        "code": "12945",
        "sku": "MP-L270PP",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "14.000KG",
        "cbm": "0.084",
        "price": 0.68,
        "stock": 3000,
        "unit": "PZA"
    },
    {
        "name": "LLANA PLASTICA 270X180 MEGAPRO",
        "code": "12942",
        "sku": "MP-L270AB",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "14.000KG",
        "cbm": "0.086",
        "price": 0.73,
        "stock": 1560,
        "unit": "PZA"
    },

    # PAGE 56
    {
        "name": "LLANA PLASTICA 320 X 220 MEGAPRO",
        "code": "12946",
        "sku": "MP-L320PP",
        "empaque": "50",
        "pie_cub": "0.0000",
        "peso": "14.000KG",
        "cbm": "0.101",
        "price": 1.00,
        "stock": 1500,
        "unit": "PZA"
    },
    {
        "name": "LLANA PLASTICA 340X230 MEGAPRO",
        "code": "12943",
        "sku": "MP-L340AB",
        "empaque": "36",
        "pie_cub": "0.0000",
        "peso": "13.000KG",
        "cbm": "0.092",
        "price": 1.20,
        "stock": 864,
        "unit": "PZA"
    },
    {
        "name": "LLANA PLASTICA MEGAPRO 32 * 22 cm",
        "code": "10058",
        "sku": "MP-PDP3222",
        "empaque": "50",
        "pie_cub": "3.5451",
        "peso": "15.400KG",
        "cbm": "0.100",
        "price": 1.25,
        "stock": 4824,
        "unit": "PZA"
    },
    {
        "name": "LLAVE DE CRUZ MEGAPRO",
        "code": "12894",
        "sku": "MP-LLC23-1",
        "empaque": "20",
        "pie_cub": "0.0000",
        "peso": "20.000KG",
        "cbm": "0.030",
        "price": 2.49,
        "stock": 120,
        "unit": "PZA"
    },
    {
        "name": "LLAVE DE IMPACTO 550NM MEGAPRO",
        "code": "12637",
        "sku": "MP-LDI3P",
        "empaque": "4",
        "pie_cub": "1.8693",
        "peso": "15.300KG",
        "cbm": "0.053",
        "price": 49.00,
        "stock": 60,
        "unit": "PZA"
    },
    {
        "name": "MACRO FIBRA PARA CONCRETO MEGAPRO",
        "code": "10052",
        "sku": "MP-MCPPU54MM",
        "empaque": "28",
        "pie_cub": "1.8180",
        "peso": "18.200KG",
        "cbm": "0.052",
        "price": 2.95,
        "stock": 20,
        "unit": "PZA"
    },
    {
        "name": "MALLA CUADROS ELECTRO GALVANIZADA 1 1*25 MT MEGAPRO",
        "code": "11819",
        "sku": "MP-MCE1",
        "empaque": "1",
        "pie_cub": "0.4414",
        "peso": "5.400KG",
        "cbm": "0.013",
        "price": 9.49,
        "stock": 80,
        "unit": "PZA"
    },
    {
        "name": "MALLA CUADROS ELECTRO GALVANIZADA 3/4 1*25 MT MEGAP",
        "code": "11818",
        "sku": "MP-MCE3-4",
        "empaque": "1",
        "pie_cub": "0.5650",
        "peso": "7.100KG",
        "cbm": "0.016",
        "price": 11.52,
        "stock": 40,
        "unit": "PZA"
    },
    {
        "name": "MALLA DE ALAMBRE CUADRADO 16X16 1*25 MT MEGAPRO",
        "code": "11824",
        "sku": "MP-MCT16X16",
        "empaque": "1",
        "pie_cub": "0.5650",
        "peso": "7.400KG",
        "cbm": "0.016",
        "price": 16.91,
        "stock": 20,
        "unit": "PZA"
    },

    # PAGE 57
    {
        "name": "MALLA DE ALAMBRE CUADRADO 5X5 1*15 MT MEGAPRO",
        "code": "11827",
        "sku": "MP-MCT5X515M",
        "empaque": "1",
        "pie_cub": "0.4238",
        "peso": "5.880KG",
        "cbm": "0.012",
        "price": 20.23,
        "stock": 14,
        "unit": "PZA"
    },
    {
        "name": "MALLA DE ALAMBRE CUADRADO 5X5 1*25 MT MEGAPRO",
        "code": "11823",
        "sku": "MP-MCT5X5",
        "empaque": "1",
        "pie_cub": "0.6357",
        "peso": "9.800KG",
        "cbm": "0.018",
        "price": 33.55,
        "stock": 3,
        "unit": "PZA"
    },
    {
        "name": "MALLA DE ALAMBRE CUADRADO 6X6 1*15 MT MEGAPRO",
        "code": "11826",
        "sku": "MP-MCT6X615M",
        "empaque": "1",
        "pie_cub": "0.3885",
        "peso": "5.520KG",
        "cbm": "0.011",
        "price": 20.15,
        "stock": 5,
        "unit": "PZA"
    },
    {
        "name": "MALLA DE ALAMBRE CUADRADO 6X6 1*25 MT MEGAPRO",
        "code": "11822",
        "sku": "MP-MCT6X6",
        "empaque": "1",
        "pie_cub": "0.6357",
        "peso": "9.200KG",
        "cbm": "0.018",
        "price": 33.55,
        "stock": 15,
        "unit": "PZA"
    },
    {
        "name": "MALLA DE ALAMBRE CUADRADO 8X8 1*15 MT MEGAPRO",
        "code": "11825",
        "sku": "MP-MCT8X815M",
        "empaque": "1",
        "pie_cub": "0.3885",
        "peso": "5.760KG",
        "cbm": "0.011",
        "price": 21.94,
        "stock": 14,
        "unit": "PZA"
    },
    {
        "name": "MALLA DE ALAMBRE CUADRADO 8X8 1*25 MT MEGAPRO",
        "code": "11821",
        "sku": "MP-MCT8X8",
        "empaque": "1",
        "pie_cub": "0.6357",
        "peso": "9.600KG",
        "cbm": "0.018",
        "price": 36.54,
        "stock": 15,
        "unit": "PZA"
    },
    {
        "name": "MALLA DE CICLON PARA CERCA 1.5*25 MT MEGAPRO",
        "code": "11820",
        "sku": "MP-MG6X6E",
        "empaque": "1",
        "pie_cub": "6.0741",
        "peso": "50.000KG",
        "cbm": "0.172",
        "price": 64.95,
        "stock": 1,
        "unit": "PZA"
    },
    {
        "name": "MALLA HEXAGONAL 1/2 1*25 MT MEGAPRO",
        "code": "11815",
        "sku": "MP-MHG1-225",
        "empaque": "1",
        "pie_cub": "0.8554",
        "peso": "12.100KG",
        "cbm": "0.020",
        "price": 16.54,
        "stock": 209,
        "unit": "PZA"
    },
    {
        "name": "MALLA HEXAGONAL 1/2 1*45 MT MEGAPRO",
        "code": "11816",
        "sku": "MP-MHG45-21",
        "empaque": "1",
        "pie_cub": "0.7435",
        "peso": "21.800KG",
        "cbm": "0.020",
        "price": 30.75,
        "stock": 50,
        "unit": "PZA"
    },

    # PAGE 58
    {
        "name": "MALLA HEXAGONAL 3/4 1*25 MT MEGAPRO",
        "code": "11813",
        "sku": "MP-MHG3-425",
        "empaque": "1",
        "pie_cub": "0.6671",
        "peso": "9.000KG",
        "cbm": "0.020",
        "price": 12.51,
        "stock": 260,
        "unit": "PZA"
    },
    {
        "name": "MALLA HEXAGONAL 3/4 1*45 MT MEGAPRO",
        "code": "11814",
        "sku": "MP-MHG45-16",
        "empaque": "1",
        "pie_cub": "1.2478",
        "peso": "16.100KG",
        "cbm": "0.040",
        "price": 21.99,
        "stock": 50,
        "unit": "PZA"
    },
    {
        "name": "MALLA P/IMPERMEABILIZAR CON PINT. EPOXICA 100M MEGAPRO",
        "code": "10951",
        "sku": "MP-MAIMP100M",
        "empaque": "1",
        "pie_cub": "3.6551",
        "peso": "21.500KG",
        "cbm": "0.104",
        "price": 43.31,
        "stock": 80,
        "unit": "PZA"
    },
    {
        "name": "MALLA P/IMPERMEABILIZAR CON PINT. EPOXICA 50M MEGAPRO",
        "code": "10952",
        "sku": "MP-MAIMP50M",
        "empaque": "2",
        "pie_cub": "3.5784",
        "peso": "22.000KG",
        "cbm": "0.101",
        "price": 23.45,
        "stock": 60,
        "unit": "PZA"
    },
    {
        "name": "MANDRIL PARA TALADRO MEGAPRO",
        "code": "10920",
        "sku": "MP-KMP13MM",
        "empaque": "60",
        "pie_cub": "0.8281",
        "peso": "15.800KG",
        "cbm": "0.024",
        "price": 1.20,
        "stock": 2160,
        "unit": "SET"
    },
    {
        "name": "MANGO CON RODILLO PARA PINTAR MEGAPRO",
        "code": "10136",
        "sku": "MP-RPWP742",
        "empaque": "60",
        "pie_cub": "2.4296",
        "peso": "14.000KG",
        "cbm": "0.069",
        "price": 1.09,
        "stock": 1200,
        "unit": "PZA"
    },
    {
        "name": "MANGUERA DE PRESION 1/4 MEGAPRO",
        "code": "11639",
        "sku": "MP-MR14",
        "empaque": "6",
        "pie_cub": "1.6209",
        "peso": "17.170KG",
        "cbm": "0.046",
        "price": 7.69,
        "stock": 8,
        "unit": "PZA"
    },
    {
        "name": "MANGUERA DE PRESION 3/8 MEGAPRO",
        "code": "11641",
        "sku": "MP-MR38",
        "empaque": "5",
        "pie_cub": "1.9070",
        "peso": "20.700KG",
        "cbm": "0.054",
        "price": 11.25,
        "stock": 2,
        "unit": "PZA"
    },
    {
        "name": "MANGUERA PARA HIDROLAVADORA MEGAPRO",
        "code": "10941",
        "sku": "MP-MPH577",
        "empaque": "30",
        "pie_cub": "2.6597",
        "peso": "14.980KG",
        "cbm": "0.075",
        "price": 4.10,
        "stock": 300,
        "unit": "PZA"
    },

    # PAGE 59
    {
        "name": "MANGUERA PARA HIDROLAVADORA MEGAPRO",
        "code": "10942",
        "sku": "MP-MPH578",
        "empaque": "30",
        "pie_cub": "2.7233",
        "peso": "14.980KG",
        "cbm": "0.077",
        "price": 4.32,
        "stock": 180,
        "unit": "PZA"
    },
    {
        "name": "MANILLA FIJA-MOVIL BLANCA MEGAPRO",
        "code": "11423",
        "sku": "MP-PPHND115",
        "empaque": "40",
        "pie_cub": "2.3189",
        "peso": "14.440KG",
        "cbm": "0.066",
        "price": 3.38,
        "stock": 240,
        "unit": "PZA"
    },
    {
        "name": "MANILLA FIJA-MOVIL NEGRA MEGAPRO",
        "code": "11422",
        "sku": "MP-PPHND114",
        "empaque": "40",
        "pie_cub": "2.3189",
        "peso": "14.440KG",
        "cbm": "0.066",
        "price": 3.38,
        "stock": 240,
        "unit": "PZA"
    },
    {
        "name": "MANILLA FIJA-MOVIL PLATEADA MEGAPRO",
        "code": "11421",
        "sku": "MP-PPHND113",
        "empaque": "40",
        "pie_cub": "2.3189",
        "peso": "14.440KG",
        "cbm": "0.066",
        "price": 3.38,
        "stock": 234,
        "unit": "PZA"
    },
    {
        "name": "MANILLA MOVIL-MOVIL BLANCA MEGAPRO",
        "code": "11420",
        "sku": "MP-PPHND112",
        "empaque": "40",
        "pie_cub": "2.3189",
        "peso": "14.440KG",
        "cbm": "0.066",
        "price": 3.38,
        "stock": 34,
        "unit": "PZA"
    },
    {
        "name": "MANILLA MOVIL-MOVIL NEGRA MEGAPRO",
        "code": "11419",
        "sku": "MP-PPHND111",
        "empaque": "40",
        "pie_cub": "2.3189",
        "peso": "14.440KG",
        "cbm": "0.066",
        "price": 3.38,
        "stock": 234,
        "unit": "PZA"
    },
    {
        "name": "MANILLA MOVIL-MOVIL PLATEADA MEGAPRO",
        "code": "11418",
        "sku": "MP-PPHND110",
        "empaque": "40",
        "pie_cub": "2.3189",
        "peso": "14.440KG",
        "cbm": "0.066",
        "price": 3.38,
        "stock": 34,
        "unit": "PZA"
    },
    {
        "name": "MANILLA PARA CERRADURA MEGAPRO",
        "code": "13114",
        "sku": "MP-C24114",
        "empaque": "40",
        "pie_cub": "0.0000",
        "peso": "23.000KG",
        "cbm": "0.078",
        "price": 3.34,
        "stock": 800,
        "unit": "PZA"
    },
    {
        "name": "MANILLA PARA CERRADURA MEGAPRO",
        "code": "13113",
        "sku": "MP-M25066",
        "empaque": "20",
        "pie_cub": "0.0000",
        "peso": "12.000KG",
        "cbm": "0.072",
        "price": 3.89,
        "stock": 1000,
        "unit": "PZA"
    },

    # PAGE 60
    {
        "name": "MANILLA PARA CERRADURA MEGAPRO",
        "code": "13112",
        "sku": "MP-M26065",
        "empaque": "20",
        "pie_cub": "0.0000",
        "peso": "11.900KG",
        "cbm": "0.072",
        "price": 3.89,
        "stock": 1000,
        "unit": "PZA"
    },
    {
        "name": "MANILLA PARA CERRADURA MEGAPRO",
        "code": "10602",
        "sku": "MP-QMGH506",
        "empaque": "20",
        "pie_cub": "2.7040",
        "peso": "13.500KG",
        "cbm": "0.077",
        "price": 3.19,
        "stock": 32,
        "unit": "PAR"
    },
    {
        "name": "MAQUINA DE SOLDAR 160 AMP PUMA MEGAPRO",
        "code": "10616",
        "sku": "MP-WM-630063",
        "empaque": "1",
        "pie_cub": "0.4265",
        "peso": "5.400KG",
        "cbm": "0.012",
        "price": 60.19,
        "stock": 171,
        "unit": "PZA"
    },
    {
        "name": "MARCO CON SEGUETA MEGAPRO",
        "code": "12390",
        "sku": "MP-SPS3058",
        "empaque": "48",
        "pie_cub": "1.6895",
        "peso": "13.700KG",
        "cbm": "0.048",
        "price": 1.42,
        "stock": 1728,
        "unit": "PZA"
    },
    {
        "name": "MASCARA MEGAPRO",
        "code": "10626",
        "sku": "MP-PFPFS",
        "empaque": "40",
        "pie_cub": "4.1954",
        "peso": "13.300KG",
        "cbm": "0.119",
        "price": 1.76,
        "stock": 1118,
        "unit": "SETS"
    },
    {
        "name": "MASCARA MEGAPRO",
        "code": "10623",
        "sku": "TADS001",
        "empaque": "100",
        "pie_cub": "5.0323",
        "peso": "16.200KG",
        "cbm": "0.143",
        "price": 2.07,
        "stock": 294,
        "unit": "PZA"
    },
    {
        "name": "MASKING TAPE 18mmx20m MEGAPRO",
        "code": "12908",
        "sku": "MP-CER182",
        "empaque": "180",
        "pie_cub": "0.0000",
        "peso": "7.800KG",
        "cbm": "0.043",
        "price": 0.25,
        "stock": 9000,
        "unit": "PZA"
    },
    {
        "name": "MASKING TAPE 24mmx20m MEGAPRO",
        "code": "12909",
        "sku": "MP-CER240",
        "empaque": "120",
        "pie_cub": "0.0000",
        "peso": "7.000KG",
        "cbm": "0.035",
        "price": 0.29,
        "stock": 13200,
        "unit": "PZA"
    },
    {
        "name": "MASKING TAPE 36mmx20m MEGAPRO",
        "code": "12910",
        "sku": "MP-CER362",
        "empaque": "72",
        "pie_cub": "0.0000",
        "peso": "6.300KG",
        "cbm": "0.032",
        "price": 0.45,
        "stock": 4320,
        "unit": "PZA"
    },

    # PAGE 61
    {
        "name": "MASKING TAPE 48mmx20m MEGAPRO",
        "code": "12911",
        "sku": "MP-CER460",
        "empaque": "48",
        "pie_cub": "0.0000",
        "peso": "5.500KG",
        "cbm": "0.029",
        "price": 0.59,
        "stock": 2400,
        "unit": "PZA"
    },
    {
        "name": "MECATE 10MM MEGAPRO",
        "code": "10227",
        "sku": "MP-MA1012",
        "empaque": "1",
        "pie_cub": "1.1124",
        "peso": "10.500KG",
        "cbm": "0.032",
        "price": 32.48,
        "stock": 1,
        "unit": "ROLL"
    },
    {
        "name": "MECATE 11MM MEGAPRO",
        "code": "10228",
        "sku": "MP-MA11716",
        "empaque": "1",
        "pie_cub": "1.1124",
        "peso": "10.500KG",
        "cbm": "0.032",
        "price": 32.48,
        "stock": 33,
        "unit": "ROLL"
    },
    {
        "name": "MECATE 12MM MEGAPRO",
        "code": "10792",
        "sku": "MP-MA12916",
        "empaque": "1",
        "pie_cub": "1.0182",
        "peso": "10.433KG",
        "cbm": "0.029",
        "price": 35.13,
        "stock": 54,
        "unit": "PZA"
    },
    {
        "name": "MECATE 16MM MEGAPRO",
        "code": "10793",
        "sku": "MP-MA1634",
        "empaque": "1",
        "pie_cub": "1.0182",
        "peso": "10.433KG",
        "cbm": "0.029",
        "price": 32.15,
        "stock": 77,
        "unit": "PZA"
    },
    {
        "name": "MECATE 4MM MEGAPRO",
        "code": "10230",
        "sku": "MP-MA4316",
        "empaque": "1",
        "pie_cub": "1.1124",
        "peso": "10.500KG",
        "cbm": "0.032",
        "price": 32.90,
        "stock": 51,
        "unit": "ROLL"
    },

    # PAGE 62
    {
        "name": "MECATE 5MM MEGAPRO",
        "code": "10789",
        "sku": "MP-MA514",
        "empaque": "1",
        "pie_cub": "1.0300",
        "peso": "10.433KG",
        "cbm": "0.029",
        "price": 32.63,
        "stock": 3,
        "unit": "PZA"
    },
    {
        "name": "MECATE 6MM MEGAPRO",
        "code": "10790",
        "sku": "MP-MA6516",
        "empaque": "1",
        "pie_cub": "1.0300",
        "peso": "10.433KG",
        "cbm": "0.029",
        "price": 32.20,
        "stock": 44,
        "unit": "PZA"
    },
    {
        "name": "MECATE 8MM MEGAPRO",
        "code": "10791",
        "sku": "MP-MA838",
        "empaque": "1",
        "pie_cub": "1.0300",
        "peso": "10.433KG",
        "cbm": "0.029",
        "price": 32.63,
        "stock": 1,
        "unit": "PZA"
    },
    {
        "name": "MEDIDOR DE VOLTAJE MEGAPRO",
        "code": "11618",
        "sku": "MP-BC0030",
        "empaque": "100",
        "pie_cub": "2.7774",
        "peso": "15.000KG",
        "cbm": "0.080",
        "price": 0.89,
        "stock": 1600,
        "unit": "PZA"
    },
    {
        "name": "MEDIDOR DE VOLTAJE MEGAPRO",
        "code": "11619",
        "sku": "MP-TE2P-PLOG",
        "empaque": "24",
        "pie_cub": "2.0316",
        "peso": "6.300KG",
        "cbm": "0.060",
        "price": 3.14,
        "stock": 6,
        "unit": "PZA"
    },
    {
        "name": "MOTOSIERRA 22 PULG MEGAPRO",
        "code": "12142",
        "sku": "MP-M22S58",
        "empaque": "2",
        "pie_cub": "2.4485",
        "peso": "15.200KG",
        "cbm": "0.070",
        "price": 47.79,
        "stock": 42,
        "unit": "PZA"
    },

    # PAGE 63
    {
        "name": "MOTOSIERRA 22 PULG. MEGAPRO",
        "code": "12961",
        "sku": "MP-MOTSI22P",
        "empaque": "2",
        "pie_cub": "0.0000",
        "peso": "16.600KG",
        "cbm": "0.091",
        "price": 51.88,
        "stock": 194,
        "unit": "PZA"
    },
    {
        "name": "NYLON 210D-12 COLORES MEGAPRO",
        "code": "10688",
        "sku": "MP-NYC120",
        "empaque": "80",
        "pie_cub": "2.0068",
        "peso": "21.079KG",
        "cbm": "0.057",
        "price": 0.96,
        "stock": 320,
        "unit": "ROLL"
    },
    {
        "name": "NYLON 210D-12 MEGAPRO",
        "code": "10682",
        "sku": "MP-NY12",
        "empaque": "80",
        "pie_cub": "2.0068",
        "peso": "21.079KG",
        "cbm": "0.057",
        "price": 0.92,
        "stock": 2000,
        "unit": "ROLL"
    },
    {
        "name": "NYLON 210D-18 MEGAPRO",
        "code": "10684",
        "sku": "MP-NY182",
        "empaque": "80",
        "pie_cub": "2.0180",
        "peso": "21.079KG",
        "cbm": "0.057",
        "price": 0.86,
        "stock": 2080,
        "unit": "ROLL"
    },
    {
        "name": "NYLON 210D-21 MEGAPRO",
        "code": "10685",
        "sku": "MP-NY21",
        "empaque": "80",
        "pie_cub": "1.9339",
        "peso": "21.079KG",
        "cbm": "0.055",
        "price": 0.85,
        "stock": 2880,
        "unit": "ROLL"
    },
    {
        "name": "NYLON 210D-24 MEGAPRO",
        "code": "10686",
        "sku": "MP-NY240",
        "empaque": "80",
        "pie_cub": "1.9339",
        "peso": "21.079KG",
        "cbm": "0.055",
        "price": 0.85,
        "stock": 2080,
        "unit": "ROLL"
    },

    # PAGE 64
    {
        "name": "NYLON 210D-30 MEGAPRO",
        "code": "10687",
        "sku": "MP-NY30",
        "empaque": "80",
        "pie_cub": "1.9339",
        "peso": "21.079KG",
        "cbm": "0.055",
        "price": 0.85,
        "stock": 2880,
        "unit": "ROLL"
    },
    {
        "name": "NYLON 210D-9 MEGAPRO",
        "code": "10683",
        "sku": "MP-NY150",
        "empaque": "80",
        "pie_cub": "2.0180",
        "peso": "21.079KG",
        "cbm": "0.057",
        "price": 0.86,
        "stock": 2080,
        "unit": "ROLL"
    },
    {
        "name": "NYLON 210D-9 MEGAPRO",
        "code": "10681",
        "sku": "MP-NY90",
        "empaque": "80",
        "pie_cub": "2.0068",
        "peso": "21.079KG",
        "cbm": "0.057",
        "price": 0.92,
        "stock": 2080,
        "unit": "ROLL"
    },
    {
        "name": "PALUSTRA PLASTICA MEGAPRO",
        "code": "12948",
        "sku": "MP-L280PS",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "11.000KG",
        "cbm": "0.100",
        "price": 1.16,
        "stock": 780,
        "unit": "PZA"
    },
    {
        "name": "PEGAMENTO PARA PARABRISAS MEGAPRO",
        "code": "10985",
        "sku": "MP-SPP181",
        "empaque": "20",
        "pie_cub": "0.5231",
        "peso": "9.889KG",
        "cbm": "0.015",
        "price": 2.14,
        "stock": 1680,
        "unit": "PZA"
    },
    {
        "name": "PEGAMENTO TRABA ROSCA MEGAPRO",
        "code": "10059",
        "sku": "MG-ADF10057",
        "empaque": "144",
        "pie_cub": "1.5242",
        "peso": "5.300KG",
        "cbm": "0.043",
        "price": 0.49,
        "stock": 720,
        "unit": "PZA"
    },

    # PAGE 65
    {
        "name": "PERNO DE BRONCE",
        "code": "12880",
        "sku": "MP-KS1501",
        "empaque": "500",
        "pie_cub": "0.0000",
        "peso": "6.000KG",
        "cbm": "0.010",
        "price": 0.49,
        "stock": 250,
        "unit": "PZA"
    },
    {
        "name": "PERNO DE BRONCE",
        "code": "12881",
        "sku": "MP-KS1702",
        "empaque": "500",
        "pie_cub": "0.0000",
        "peso": "9.000KG",
        "cbm": "0.010",
        "price": 0.63,
        "stock": 250,
        "unit": "PZA"
    },
    {
        "name": "PERNO DE BRONCE",
        "code": "12882",
        "sku": "MP-KS2003",
        "empaque": "500",
        "pie_cub": "0.0000",
        "peso": "12.000KG",
        "cbm": "0.010",
        "price": 0.88,
        "stock": 125,
        "unit": "PZA"
    },
    {
        "name": "PINTURA IMPERMEABILIZANTE EPOXICA 10KG MEGAPRO",
        "code": "11561",
        "sku": "MP-REIP10KG",
        "empaque": "1",
        "pie_cub": "0.6696",
        "peso": "10.500KG",
        "cbm": "0.020",
        "price": 22.81,
        "stock": 100,
        "unit": "PZA"
    },
    {
        "name": "PINTURA IMPERMEABILIZANTE EPOXICA 20KG MEGAPRO",
        "code": "11562",
        "sku": "MP-REIP20KG",
        "empaque": "1",
        "pie_cub": "1.2149",
        "peso": "20.801KG",
        "cbm": "0.030",
        "price": 43.91,
        "stock": 250,
        "unit": "PZA"
    },
    {
        "name": "PINZA SACA RETENEDORES 7 PULG. MEGAPRO",
        "code": "11444",
        "sku": "MP-ALC-7P",
        "empaque": "60",
        "pie_cub": "0.8920",
        "peso": "11.800KG",
        "cbm": "0.025",
        "price": 1.51,
        "stock": 180,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA DE CALOR 1800 WATT MEGAPRO",
        "code": "12639",
        "sku": "MP-PC18W",
        "empaque": "10",
        "pie_cub": "2.1330",
        "peso": "9.310KG",
        "cbm": "0.060",
        "price": 12.50,
        "stock": 70,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA DE CLAVO MEGAPRO",
        "code": "12940",
        "sku": "MP-MPCRMP",
        "empaque": "30",
        "pie_cub": "0.0000",
        "peso": "20.000KG",
        "cbm": "0.068",
        "price": 3.16,
        "stock": 900,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA ELECTRICA DE PINTAR MEGAPRO",
        "code": "13028",
        "sku": "MP-PP70022",
        "empaque": "10",
        "pie_cub": "0.0000",
        "peso": "13.400KG",
        "cbm": "0.110",
        "price": 14.15,
        "stock": 330,
        "unit": "PZA"
    },

    # PAGE 66
    {
        "name": "PISTOLA HIDROJET MEGAPRO",
        "code": "12138",
        "sku": "MP-LLC23",
        "empaque": "50",
        "pie_cub": "2.5815",
        "peso": "18.800KG",
        "cbm": "0.073",
        "price": 3.46,
        "stock": 1350,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA PARA HIDROJET MEGAPRO",
        "code": "12952",
        "sku": "MP-AP21CP",
        "empaque": "50",
        "pie_cub": "0.0000",
        "peso": "13.800KG",
        "cbm": "0.072",
        "price": 2.27,
        "stock": 450,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA PARA HIDROJET MEGAPRO",
        "code": "12951",
        "sku": "MP-CP22AP",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "15.450KG",
        "cbm": "0.073",
        "price": 2.63,
        "stock": 600,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA PARA HIDROJET MEGAPRO",
        "code": "12955",
        "sku": "MP-PPH1550",
        "empaque": "50",
        "pie_cub": "0.0000",
        "peso": "21.750KG",
        "cbm": "0.141",
        "price": 4.04,
        "stock": 450,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA PARA HIDROJET MEGAPRO",
        "code": "12956",
        "sku": "MP-PPH2020",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "15.900KG",
        "cbm": "0.073",
        "price": 1.89,
        "stock": 1140,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA PARA HIDROJET MEGAPRO",
        "code": "12954",
        "sku": "MP-PPH2319",
        "empaque": "50",
        "pie_cub": "0.0000",
        "peso": "13.700KG",
        "cbm": "0.073",
        "price": 2.12,
        "stock": 450,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA PARA HIDROJET MEGAPRO",
        "code": "12953",
        "sku": "MP-PPH2618",
        "empaque": "50",
        "pie_cub": "0.0000",
        "peso": "15.600KG",
        "cbm": "0.078",
        "price": 2.87,
        "stock": 450,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA PARA HIDROJET MEGAPRO",
        "code": "12957",
        "sku": "MP-PPH2714",
        "empaque": "40",
        "pie_cub": "0.0000",
        "peso": "14.800KG",
        "cbm": "0.063",
        "price": 3.47,
        "stock": 1080,
        "unit": "PZA"
    },
    {
        "name": "PISTOLA PARA HIDROJET MEGAPRO",
        "code": "12958",
        "sku": "MP-PPH8015",
        "empaque": "30",
        "pie_cub": "0.0000",
        "peso": "17.200KG",
        "cbm": "0.069",
        "price": 5.80,
        "stock": 510,
        "unit": "PZA"
    },

    # PAGE 67
    {
        "name": "PISTOLA PARA PINTAR MEGAPRO",
        "code": "10915",
        "sku": "MP-PEPP186",
        "empaque": "6",
        "pie_cub": "2.5284",
        "peso": "12.000KG",
        "cbm": "0.072",
        "price": 15.42,
        "stock": 1142,
        "unit": "PZA"
    },
    {
        "name": "PLAFON DE PORCELANA 4.1/2 PULG. MEGAPRO",
        "code": "12939",
        "sku": "MP-PLP110V",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "18.000KG",
        "cbm": "0.040",
        "price": 0.53,
        "stock": 5700,
        "unit": "PZA"
    },
    {
        "name": "PLAFON PLASTICO BLANCO MEGAPRO",
        "code": "13026",
        "sku": "MP-ER2740",
        "empaque": "240",
        "pie_cub": "0.0000",
        "peso": "17.210KG",
        "cbm": "0.152",
        "price": 0.38,
        "stock": 720,
        "unit": "PZA"
    },
    {
        "name": "PLATERA ORGANIZADORA",
        "code": "11526",
        "sku": "MGYW250570",
        "empaque": "4",
        "pie_cub": "4.1090",
        "peso": "18.839KG",
        "cbm": "0.116",
        "price": 14.84,
        "stock": 100,
        "unit": "PZA"
    },
    {
        "name": "PRENSA HIDRAULICA 12 TON MEGAPRO",
        "code": "11946",
        "sku": "MP-PHWBJ-12T",
        "empaque": "1",
        "pie_cub": "1.5240",
        "peso": "41.000KG",
        "cbm": "0.043",
        "price": 91.12,
        "stock": 13,
        "unit": "PZA"
    },
    {
        "name": "PRENSA HIDRAULICA 12 TONELADA MEGAPRO",
        "code": "11637",
        "sku": "MP-PHWG-12T",
        "empaque": "1",
        "pie_cub": "3.3620",
        "peso": "58.000KG",
        "cbm": "0.095",
        "price": 182.80,
        "stock": 1,
        "unit": "PZA"
    },
    {
        "name": "PRENSA HIDRAULICA 20 TON MEGAPRO",
        "code": "11947",
        "sku": "MP-PHWBJ-20T",
        "empaque": "1",
        "pie_cub": "1.0255",
        "peso": "37.000KG",
        "cbm": "0.029",
        "price": 142.61,
        "stock": 3,
        "unit": "PZA"
    },
    {
        "name": "PROBADOR DE CORRIENTE MEGAPRO",
        "code": "13029",
        "sku": "MP-TBE3E1",
        "empaque": "120",
        "pie_cub": "0.0000",
        "peso": "9.600KG",
        "cbm": "0.070",
        "price": 1.06,
        "stock": 3600,
        "unit": "PZA"
    },
    {
        "name": "PROTECTOR DE VOLTAJE 220 VOLT MEGAPRO",
        "code": "10233",
        "sku": "MP-PVPLU220",
        "empaque": "100",
        "pie_cub": "4.2992",
        "peso": "20.000KG",
        "cbm": "0.122",
        "price": 3.82,
        "stock": 2,
        "unit": "PZA"
    },

    # PAGE 68
    {
        "name": "PROTECTOR DE VOLTAJE REFRIGERADORES MEGAPRO",
        "code": "10054",
        "sku": "MP-PVPRO120",
        "empaque": "100",
        "pie_cub": "3.8723",
        "peso": "13.000KG",
        "cbm": "0.110",
        "price": 2.77,
        "stock": 2200,
        "unit": "PZA"
    },
    {
        "name": "PROTECTOR DE VOLTAJE TRIPLE MEGAPRO",
        "code": "10824",
        "sku": "MP-PV3T120",
        "empaque": "100",
        "pie_cub": "3.2313",
        "peso": "16.000KG",
        "cbm": "0.092",
        "price": 3.38,
        "stock": 1400,
        "unit": "PZA"
    },
    {
        "name": "PUERTAS DE SEGURIDAD MEGAPRO",
        "code": "10828",
        "sku": "MP-PBC002",
        "empaque": "1",
        "pie_cub": "7.0629",
        "peso": "27.000KG",
        "cbm": "0.200",
        "price": 95.72,
        "stock": 4,
        "unit": "PZA"
    },
    {
        "name": "PUERTAS DE SEGURIDAD MEGAPRO",
        "code": "10833",
        "sku": "MP-PGM005",
        "empaque": "1",
        "pie_cub": "7.0629",
        "peso": "34.500KG",
        "cbm": "0.200",
        "price": 137.15,
        "stock": 5,
        "unit": "PZA"
    },
    {
        "name": "PULIDORA 7 PULG 1400 WATT MEGAPRO",
        "code": "12638",
        "sku": "MP-PA67P",
        "empaque": "4",
        "pie_cub": "1.7139",
        "peso": "15.060KG",
        "cbm": "0.049",
        "price": 33.00,
        "stock": 148,
        "unit": "PZA"
    },
    {
        "name": "RACHE DE 1/2 PULG. MEGAPRO",
        "code": "11396",
        "sku": "MG-LLR12",
        "empaque": "20",
        "pie_cub": "0.3456",
        "peso": "11.000KG",
        "cbm": "0.010",
        "price": 3.35,
        "stock": 20,
        "unit": "PZA"
    },
    {
        "name": "RACHE DE 1/4 PULG. MEGAPRO",
        "code": "11398",
        "sku": "MG-LLR14",
        "empaque": "80",
        "pie_cub": "0.5295",
        "peso": "13.500KG",
        "cbm": "0.015",
        "price": 1.85,
        "stock": 80,
        "unit": "PZA"
    },
    {
        "name": "RAMPLUG DE HIERRO X2 PZAS M10 MEGAPRO",
        "code": "13125",
        "sku": "MP-PEHM10",
        "empaque": "100",
        "pie_cub": "0.0000",
        "peso": "14.500KG",
        "cbm": "0.017",
        "price": 0.59,
        "stock": 3000,
        "unit": "PZA"
    },
    {
        "name": "RAMPLUG DE HIERRO X2 PZAS M12 MEGAPRO",
        "code": "13126",
        "sku": "MP-PEM12",
        "empaque": "100",
        "pie_cub": "0.0000",
        "peso": "27.100KG",
        "cbm": "0.028",
        "price": 0.64,
        "stock": 3000,
        "unit": "PZA"
    },

    # PAGE 69
    {
        "name": "RAMPLUG DE HIERRO X4 PZAS M6 MEGAPRO",
        "code": "12897",
        "sku": "MP-PEHM6",
        "empaque": "160",
        "pie_cub": "0.0000",
        "peso": "13.700KG",
        "cbm": "0.010",
        "price": 0.41,
        "stock": 3240,
        "unit": "PZA"
    },
    {
        "name": "RAMPLUG DE HIERRO X4 PZAS M8 MEGAPRO",
        "code": "12898",
        "sku": "MP-PEM8",
        "empaque": "150",
        "pie_cub": "0.0000",
        "peso": "24.400KG",
        "cbm": "0.020",
        "price": 0.45,
        "stock": 3810,
        "unit": "PZA"
    },
    {
        "name": "REGLETA ELECTRICA MEGAPRO",
        "code": "10319",
        "sku": "MP-HTR511",
        "empaque": "48",
        "pie_cub": "1.2863",
        "peso": "12.000KG",
        "cbm": "0.036",
        "price": 1.76,
        "stock": 286,
        "unit": "PZA"
    },
    {
        "name": "REGLETA ELECTRICA MEGAPRO",
        "code": "10320",
        "sku": "MP-HTR512",
        "empaque": "48",
        "pie_cub": "1.1619",
        "peso": "12.000KG",
        "cbm": "0.033",
        "price": 1.79,
        "stock": 288,
        "unit": "PZA"
    },
    {
        "name": "REGLETA ELECTRICA MEGAPRO",
        "code": "10321",
        "sku": "MP-HTR513",
        "empaque": "48",
        "pie_cub": "1.1204",
        "peso": "12.000KG",
        "cbm": "0.032",
        "price": 1.26,
        "stock": 480,
        "unit": "PZA"
    },
    {
        "name": "REGLETA ELECTRICA MEGAPRO",
        "code": "10325",
        "sku": "MP-HTR517",
        "empaque": "48",
        "pie_cub": "1.2033",
        "peso": "12.000KG",
        "cbm": "0.034",
        "price": 1.73,
        "stock": 768,
        "unit": "PZA"
    },
    {
        "name": "REGLETA ELECTRICA MEGAPRO",
        "code": "10326",
        "sku": "MP-HTR518",
        "empaque": "48",
        "pie_cub": "1.2510",
        "peso": "12.000KG",
        "cbm": "0.035",
        "price": 1.46,
        "stock": 48,
        "unit": "PZA"
    },
    {
        "name": "REGLETA ELECTRICA MEGAPRO",
        "code": "10327",
        "sku": "MP-HTR519",
        "empaque": "48",
        "pie_cub": "2.0575",
        "peso": "12.000KG",
        "cbm": "0.058",
        "price": 2.57,
        "stock": 288,
        "unit": "PZA"
    },
    {
        "name": "REGLETA GRIS ELECTRICA MEGAPRO",
        "code": "10323",
        "sku": "MP-HTR515",
        "empaque": "48",
        "pie_cub": "1.1619",
        "peso": "12.000KG",
        "cbm": "0.033",
        "price": 1.28,
        "stock": 768,
        "unit": "PZA"
    },

    # PAGE 70
    {
        "name": "REGLETA NEGRA ELECTRICA MEGAPRO",
        "code": "10324",
        "sku": "MP-HTR516",
        "empaque": "48",
        "pie_cub": "2.1618",
        "peso": "12.000KG",
        "cbm": "0.061",
        "price": 1.89,
        "stock": 672,
        "unit": "PZA"
    },
    {
        "name": "REGULADOR DE ROSCA MEGAPRO",
        "code": "10303",
        "sku": "MP-RG-01",
        "empaque": "50",
        "pie_cub": "1.6805",
        "peso": "10.500KG",
        "cbm": "0.048",
        "price": 1.39,
        "stock": 2350,
        "unit": "PZA"
    },
    {
        "name": "REMACHADORA MEGAPRO",
        "code": "12918",
        "sku": "MP-RM24",
        "empaque": "48",
        "pie_cub": "0.0000",
        "peso": "18.000KG",
        "cbm": "0.050",
        "price": 1.40,
        "stock": 1104,
        "unit": "PZA"
    },
    {
        "name": "REMACHADORA MEGAPRO",
        "code": "10944",
        "sku": "MP-RM257",
        "empaque": "60",
        "pie_cub": "2.0850",
        "peso": "22.980KG",
        "cbm": "0.059",
        "price": 1.47,
        "stock": 960,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA RODILLO 9 PULG. MEGAPRO",
        "code": "10137",
        "sku": "MP-RPWP743",
        "empaque": "100",
        "pie_cub": "2.6054",
        "peso": "5.800KG",
        "cbm": "0.074",
        "price": 0.46,
        "stock": 4600,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA RODILLO PELO CORTO 9 PULG. MEGAPRO",
        "code": "10120",
        "sku": "MP-RPWP744",
        "empaque": "100",
        "pie_cub": "2.7651",
        "peso": "6.100KG",
        "cbm": "0.078",
        "price": 0.47,
        "stock": 1200,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA RODILLO PELO LARGO 9 PULG. MEGAPRO",
        "code": "10456",
        "sku": "MP-RPWP740",
        "empaque": "100",
        "pie_cub": "2.6054",
        "peso": "6.500KG",
        "cbm": "0.074",
        "price": 0.64,
        "stock": 5900,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA RODILLO PELO LARGO 9 PULG. MEGAPRO",
        "code": "10121",
        "sku": "MP-RPWP745",
        "empaque": "100",
        "pie_cub": "2.6627",
        "peso": "6.100KG",
        "cbm": "0.075",
        "price": 0.57,
        "stock": 3100,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA ROLDANA 1000MM MEGAPRO",
        "code": "10741",
        "sku": "MP-10020XRPP",
        "empaque": "30",
        "pie_cub": "0.4079",
        "peso": "30.940KG",
        "cbm": "0.012",
        "price": 2.49,
        "stock": 30,
        "unit": "PZA"
    },

    # PAGE 71
    {
        "name": "REPUESTO PARA ROLDANA 120MM MEGAPRO",
        "code": "10742",
        "sku": "MP-12020XRP",
        "empaque": "15",
        "pie_cub": "0.3461",
        "peso": "23.120KG",
        "cbm": "0.010",
        "price": 3.54,
        "stock": 120,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA ROLDANA 50MM MEGAPRO",
        "code": "10736",
        "sku": "MP-5017MMXRP",
        "empaque": "100",
        "pie_cub": "0.3461",
        "peso": "19.800KG",
        "cbm": "0.010",
        "price": 0.74,
        "stock": 100,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA ROLDANA 60MM MEGAPRO",
        "code": "10737",
        "sku": "MP-6017-RPMM",
        "empaque": "100",
        "pie_cub": "0.4079",
        "peso": "30.040KG",
        "cbm": "0.012",
        "price": 0.92,
        "stock": 100,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA ROLDANA 70MM MEGAPRO",
        "code": "10738",
        "sku": "MP-RPP70-20MM",
        "empaque": "50",
        "pie_cub": "0.3461",
        "peso": "22.010KG",
        "cbm": "0.010",
        "price": 1.26,
        "stock": 2,
        "unit": "PZA"
    },
    {
        "name": "REPUESTO PARA ROLDANA 80MM MEGAPRO",
        "code": "10739",
        "sku": "MP-8020-RPP",
        "empaque": "40",
        "pie_cub": "0.3461",
        "peso": "24.510KG",
        "cbm": "0.010",
        "price": 1.57,
        "stock": 200,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EMPOTRAR 50MM MEGAPRO",
        "code": "10729",
        "sku": "MP-50MMX17-RPE",
        "empaque": "50",
        "pie_cub": "0.4079",
        "peso": "13.780KG",
        "cbm": "0.012",
        "price": 1.04,
        "stock": 1000,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EMPOTRAR 100MM MEGAPRO",
        "code": "10734",
        "sku": "MP-100XMM20-RPE",
        "empaque": "20",
        "pie_cub": "0.5403",
        "peso": "26.200KG",
        "cbm": "0.015",
        "price": 2.87,
        "stock": 2,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EMPOTRAR 120MM MEGAPRO",
        "code": "10735",
        "sku": "MP-12020RPE",
        "empaque": "10",
        "pie_cub": "0.4271",
        "peso": "19.180KG",
        "cbm": "0.012",
        "price": 4.82,
        "stock": 250,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EMPOTRAR 60MM MEGAPRO",
        "code": "10730",
        "sku": "MP-60X17MM-RPE",
        "empaque": "60",
        "pie_cub": "0.4079",
        "peso": "22.510KG",
        "cbm": "0.012",
        "price": 1.24,
        "stock": 1560,
        "unit": "PZA"
    },

    # PAGE 72
    {
        "name": "ROLDANA EMPOTRAR 70MM MEGAPRO",
        "code": "10731",
        "sku": "MP-70MM-20RPE",
        "empaque": "50",
        "pie_cub": "0.5696",
        "peso": "32.250KG",
        "cbm": "0.016",
        "price": 1.58,
        "stock": 2,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EMPOTRAR 80MM MEGAPRO",
        "code": "10732",
        "sku": "MP-80MM-20RPE",
        "empaque": "40",
        "pie_cub": "0.5403",
        "peso": "31.910KG",
        "cbm": "0.015",
        "price": 2.07,
        "stock": 600,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EMPOTRAR 90MM MEGAPRO",
        "code": "10733",
        "sku": "MP-90X20-RPE",
        "empaque": "20",
        "pie_cub": "0.4271",
        "peso": "21.830KG",
        "cbm": "0.012",
        "price": 2.76,
        "stock": 320,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EN V SOBREPONER 50MM MEGAPRO",
        "code": "10725",
        "sku": "MP-50MM-24RPC",
        "empaque": "80",
        "pie_cub": "0.5403",
        "peso": "30.210KG",
        "cbm": "0.015",
        "price": 1.24,
        "stock": 480,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EN V SOBREPONER 60MM MEGAPRO",
        "code": "10726",
        "sku": "MP-60RPC-24MM",
        "empaque": "50",
        "pie_cub": "0.4271",
        "peso": "25.480KG",
        "cbm": "0.012",
        "price": 1.60,
        "stock": 1252,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA EN V SOBREPONER 70MM MEGAPRO",
        "code": "10727",
        "sku": "MP-70MMX-26RPC",
        "empaque": "30",
        "pie_cub": "0.4271",
        "peso": "23.890KG",
        "cbm": "0.012",
        "price": 2.16,
        "stock": 600,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA POLEA 30X30 MEGAPRO",
        "code": "10743",
        "sku": "MP-GDP30X30",
        "empaque": "100",
        "pie_cub": "0.6738",
        "peso": "16.050KG",
        "cbm": "0.019",
        "price": 1.34,
        "stock": 200,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA POLEA 50X45 MEGAPRO",
        "code": "10744",
        "sku": "MP-GDP50X45",
        "empaque": "50",
        "pie_cub": "0.8933",
        "peso": "15.050KG",
        "cbm": "0.025",
        "price": 2.33,
        "stock": 100,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA POLEA 65X55 MEGAPRO",
        "code": "10745",
        "sku": "MP-GDP65X55",
        "empaque": "20",
        "pie_cub": "0.6738",
        "peso": "23.850KG",
        "cbm": "0.019",
        "price": 4.41,
        "stock": 340,
        "unit": "PZA"
    },

    # PAGE 73
    {
        "name": "ROLDANA SOBREPONER 100MM MEGAPRO",
        "code": "10724",
        "sku": "MP-100V-20MM",
        "empaque": "20",
        "pie_cub": "0.5403",
        "peso": "27.970KG",
        "cbm": "0.015",
        "price": 3.10,
        "stock": 260,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA SOBREPONER 80MM MEGAPRO",
        "code": "10722",
        "sku": "MP-80MM-20V",
        "empaque": "40",
        "pie_cub": "0.5403",
        "peso": "33.700KG",
        "cbm": "0.015",
        "price": 2.14,
        "stock": 1200,
        "unit": "PZA"
    },
    {
        "name": "ROLDANA SOBREPONER 90MM MEGAPRO",
        "code": "10723",
        "sku": "MP-90MM-V20MM",
        "empaque": "30",
        "pie_cub": "0.5696",
        "peso": "35.890KG",
        "cbm": "0.016",
        "price": 2.87,
        "stock": 540,
        "unit": "PZA"
    },
    {
        "name": "ROLINERA 6201 MEGAPRO",
        "code": "12130",
        "sku": "MP-R6201",
        "empaque": "500",
        "pie_cub": "0.3140",
        "peso": "17.900KG",
        "cbm": "0.009",
        "price": 0.34,
        "stock": 3500,
        "unit": "PZA"
    },
    {
        "name": "ROLINERA R608 MEGAPRO",
        "code": "12132",
        "sku": "MP-R608",
        "empaque": "1500",
        "pie_cub": "0.3140",
        "peso": "17.650KG",
        "cbm": "0.009",
        "price": 0.21,
        "stock": 19000,
        "unit": "PZA"
    },
    {
        "name": "ROLINERA R6202 MEGAPRO",
        "code": "12131",
        "sku": "MP-R6202",
        "empaque": "400",
        "pie_cub": "0.3140",
        "peso": "17.800KG",
        "cbm": "0.009",
        "price": 0.37,
        "stock": 4400,
        "unit": "PZA"
    },
    {
        "name": "ROLLO MANTO PARA IMPERMEABILIZAR MEGAPRO",
        "code": "10950",
        "sku": "MP-CMB1M10M",
        "empaque": "1",
        "pie_cub": "0.8581",
        "peso": "18.000KG",
        "cbm": "0.024",
        "price": 39.97,
        "stock": 40,
        "unit": "PZA"
    },
    {
        "name": "RUEDA DE AIRE 10 PULG MEGAPRO",
        "code": "12919",
        "sku": "MP-NA10PL",
        "empaque": "10",
        "pie_cub": "0.0000",
        "peso": "26.500KG",
        "cbm": "0.036",
        "price": 3.29,
        "stock": 230,
        "unit": "PZA"
    },
    {
        "name": "RUEDA GIRATORIA 2 PULGADA MEGAPRO",
        "code": "10246",
        "sku": "MP-RSF28640",
        "empaque": "150",
        "pie_cub": "1.0798",
        "peso": "28.800KG",
        "cbm": "0.031",
        "price": 0.48,
        "stock": 1952,
        "unit": "PZA"
    },

    # PAGE 74
    {
        "name": "RUEDA GIRATORIA 2.5 PULGADA MEGAPRO",
        "code": "10247",
        "sku": "MP-RSF258641",
        "empaque": "60",
        "pie_cub": "0.9779",
        "peso": "29.200KG",
        "cbm": "0.028",
        "price": 1.12,
        "stock": 900,
        "unit": "PZA"
    },
    {
        "name": "RUEDA GIRATORIA 3 PULGADA MEGAPRO",
        "code": "10248",
        "sku": "MP-RSF38642",
        "empaque": "50",
        "pie_cub": "0.9779",
        "peso": "27.600KG",
        "cbm": "0.028",
        "price": 1.16,
        "stock": 652,
        "unit": "PZA"
    },
    {
        "name": "RUEDA GIRATORIA 4 PULGADA MEGAPRO",
        "code": "10249",
        "sku": "MP-RSF48643",
        "empaque": "40",
        "pie_cub": "0.9779",
        "peso": "27.400KG",
        "cbm": "0.028",
        "price": 1.44,
        "stock": 600,
        "unit": "PZA"
    },
    {
        "name": "RUEDA GIRATORIA CON FRENO 2 PULGADA MEGAPRO",
        "code": "13122",
        "sku": "MP-RCF258644",
        "empaque": "120",
        "pie_cub": "0.0000",
        "peso": "28.400KG",
        "cbm": "0.038",
        "price": 0.70,
        "stock": 1800,
        "unit": "PZA"
    },
    {
        "name": "RUEDA GIRATORIA CON FRENO 2.5 PULGADA MEGAPRO",
        "code": "10251",
        "sku": "MP-RCF258645",
        "empaque": "60",
        "pie_cub": "1.1747",
        "peso": "33.900KG",
        "cbm": "0.033",
        "price": 1.54,
        "stock": 900,
        "unit": "PZA"
    },
    {
        "name": "RUEDA GIRATORIA CON FRENO 3 PULGADA MEGAPRO",
        "code": "13123",
        "sku": "MP-RCF258646",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "37.800KG",
        "cbm": "0.041",
        "price": 1.59,
        "stock": 900,
        "unit": "PZA"
    },
    {
        "name": "RUEDA GIRATORIA CON FRENO 4 PULGADA MEGAPRO",
        "code": "13124",
        "sku": "MP-RCF258647",
        "empaque": "40",
        "pie_cub": "0.0000",
        "peso": "31.100KG",
        "cbm": "0.039",
        "price": 1.92,
        "stock": 600,
        "unit": "PZA"
    },
    {
        "name": "RUEDA GIRATORIA CON FRENO 4 PULGADA MEGAPRO",
        "code": "10253",
        "sku": "MP-RCF48647",
        "empaque": "40",
        "pie_cub": "1.1747",
        "peso": "31.100KG",
        "cbm": "0.033",
        "price": 1.63,
        "stock": 160,
        "unit": "PZA"
    },
    {
        "name": "RUEDA MACIZA 14 PULG MEGAPRO",
        "code": "12921",
        "sku": "MP-RM14PN",
        "empaque": "10",
        "pie_cub": "0.0000",
        "peso": "42.000KG",
        "cbm": "0.089",
        "price": 4.99,
        "stock": 50,
        "unit": "PZA"
    },

    # PAGE 75
    {
        "name": "SET DE BANDAJA CON RODILLO MEGAPRO",
        "code": "10444",
        "sku": "MP-RPWP747",
        "empaque": "24",
        "pie_cub": "5.4540",
        "peso": "12.003KG",
        "cbm": "0.154",
        "price": 2.84,
        "stock": 361,
        "unit": "SET"
    },
    {
        "name": "SET DE BANDEJA CON RODILLO MEGAPRO",
        "code": "10232",
        "sku": "MP-RPWP741",
        "empaque": "36",
        "pie_cub": "7.9635",
        "peso": "18.300KG",
        "cbm": "0.226",
        "price": 2.60,
        "stock": 1764,
        "unit": "PZA"
    },
    {
        "name": "SET DE BROCA SIERRA MEGAPRO",
        "code": "12389",
        "sku": "MP-KSPPM3P",
        "empaque": "100",
        "pie_cub": "2.4562",
        "peso": "19.143KG",
        "cbm": "0.070",
        "price": 0.84,
        "stock": 100,
        "unit": "PZA"
    },
    {
        "name": "SET DE BROCHAS 5 PZAS MEGAPRO",
        "code": "11935",
        "sku": "MP-K1225-3850-75",
        "empaque": "50",
        "pie_cub": "2.1676",
        "peso": "10.000KG",
        "cbm": "0.061",
        "price": 2.13,
        "stock": 2300,
        "unit": "PZA"
    },
    {
        "name": "SET DE DESTORNILLADORES 20 PCS. CON PUNTAS MEGAPRO",
        "code": "11451",
        "sku": "MP-SCWD-K20P",
        "empaque": "60",
        "pie_cub": "1.6464",
        "peso": "19.864KG",
        "cbm": "0.047",
        "price": 1.64,
        "stock": 1440,
        "unit": "PZA"
    },
    {
        "name": "SET DE DESTORNILLADORES X 2 MEGAPRO",
        "code": "11448",
        "sku": "MP-SCWD-2P",
        "empaque": "60",
        "pie_cub": "1.8357",
        "peso": "14.100KG",
        "cbm": "0.052",
        "price": 1.03,
        "stock": 840,
        "unit": "PZA"
    },
    {
        "name": "SET DE DESTORNILLADORES X 4 MEGAPRO",
        "code": "11449",
        "sku": "MP-SCWD-4P",
        "empaque": "48",
        "pie_cub": "2.3067",
        "peso": "15.600KG",
        "cbm": "0.065",
        "price": 1.77,
        "stock": 671,
        "unit": "PZA"
    },
    {
        "name": "SET DE DESTORNILLADORES X 6 MEGAPRO",
        "code": "11450",
        "sku": "MP-SCWD-6P",
        "empaque": "36",
        "pie_cub": "2.2482",
        "peso": "16.800KG",
        "cbm": "0.064",
        "price": 2.39,
        "stock": 864,
        "unit": "PZA"
    },
    {
        "name": "SET DE REPUESTO DE RODILLO X 3 MEGAPRO",
        "code": "10457",
        "sku": "MP-RPWP748",
        "empaque": "40",
        "pie_cub": "3.1444",
        "peso": "7.300KG",
        "cbm": "0.089",
        "price": 1.28,
        "stock": 200,
        "unit": "BAG"
    }
]

print(f"Total Part 3 products defined: {len(products_p51_75)}")

def get_category_and_section(name):
    name_upper = name.upper()
    if any(k in name_upper for k in ["LAMPARA", "PLAFON", "ENCHUFE", "REGLETA", "INTERRUPTO", "PROBADOR", "MEDIDOR", "PROTECTOR"]):
        return "Electricidad e Iluminación", "ELECTRICIDAD"
    elif any(k in name_upper for k in ["RODILLO", "BROCHA", "PINTAR", "PINTURA", "MASKING", "BANDEJA", "LLANA", "PALUSTRA"]):
        return "Pinturas y Acabados", "PINTURA"
    elif any(k in name_upper for k in ["SOLDAR", "ELECTRODO", "ESMERIL", "LIJADORA", "PULIDORA", "PISTOLA DE CALOR", "LLAVE DE IMPACTO", "MOTOSIERRA", "HIDROLAVADORA", "HIDROJET"]):
        return "Herramientas Eléctricas", "MAQUINARIA"
    elif any(k in name_upper for k in ["DESTORNILLADOR", "PINZA", "RACHE", "REMACHADORA", "LLAVE DE CRUZ", "MANDRIL", "SEGUETA"]):
        return "Herramientas Manuales", "HERRAMIENTAS"
    elif any(k in name_upper for k in ["MALLA", "MECATE", "NYLON", "RAMPLUG", "PERNO", "MANTO", "ROLDANA", "ROLINERA", "RUEDA", "PRENSA", "MACRO FIBRA", "PUERTAS", "MANILLA", "LENTES", "MASCARA"]):
        return "Ferretería y Construcción", "FERRETERIA"
    else:
        return "Ferretería General", "FERRETERIA"

def get_image_for_product(name):
    name_upper = name.upper()
    if "LAMPARA" in name_upper or "PLAFON" in name_upper:
        return "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=80"
    elif "REGLETA" in name_upper or "PROTECTOR" in name_upper:
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    elif "LENTES" in name_upper or "MASCARA" in name_upper:
        return "https://images.unsplash.com/photo-1578496781985-452d4a934d50?w=600&auto=format&fit=crop&q=80"
    elif "LIJADORA" in name_upper or "PULIDORA" in name_upper or "PISTOLA DE CALOR" in name_upper:
        return "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80"
    elif "LLANA" in name_upper or "PALUSTRA" in name_upper:
        return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
    elif "MALLA" in name_upper:
        return "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&auto=format&fit=crop&q=80"
    elif "MANGUERA" in name_upper or "HIDROJET" in name_upper:
        return "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
    elif "MANILLA" in name_upper:
        return "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    elif "SOLDAR" in name_upper:
        return "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80"
    elif "MASKING" in name_upper:
        return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80"
    elif "MECATE" in name_upper or "NYLON" in name_upper:
        return "https://images.unsplash.com/photo-1516216628859-9bcceabb84ca?w=600&auto=format&fit=crop&q=80"
    elif "MOTOSIERRA" in name_upper:
        return "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80"
    elif "ROLDANA" in name_upper or "ROLINERA" in name_upper or "RUEDA" in name_upper:
        return "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80"
    elif "DESTORNILLADOR" in name_upper or "RACHE" in name_upper or "REMACHADORA" in name_upper:
        return "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=600&auto=format&fit=crop&q=80"
    elif "RODILLO" in name_upper or "BROCHA" in name_upper:
        return "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80"
    else:
        return "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80"

formatted_products = []
for p in products_p51_75:
    cat, sec = get_category_and_section(p["name"])
    img = get_image_for_product(p["name"])
    pid = f"mp_{p['code']}"
    
    formatted_products.append({
        "id": pid,
        "name": p["name"],
        "price": p["price"],
        "category": cat,
        "section": sec,
        "brand": "MEGAPRO",
        "sku": p["sku"],
        "specs": {
            "Código": p["code"],
            "SKU": p["sku"],
            "Empaque": f"{p['empaque']} {p['unit']}",
            "Pie/Cub": p["pie_cub"],
            "Peso": p["peso"],
            "CBM": p["cbm"],
            "Unidad": p["unit"]
        },
        "image": img,
        "stock": p["stock"],
        "description": f"{p['name']} marca MEGAPRO. Código {p['code']}, SKU {p['sku']}. Empaque de {p['empaque']} {p['unit']}, peso {p['peso']}."
    })

with open('scripts/part3_products.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_products, f, ensure_ascii=False, indent=2)

print("Saved part3_products.json successfully!")
