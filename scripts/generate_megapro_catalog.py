import re
import json

with open("scripts/pages_dump.txt", "r", encoding="utf-8") as f:
    dump = f.read()

pages_raw = dump.split("==================== PAGE ")

all_products = []

def clean_val(v):
    return v.strip() if v else ""

# Let's write the explicit parsed list for all products in pages 1 to 25 to guarantee 100% precision.
# Let's list each item from the text with exact Code, Model, Name, Empaque, Peso, Pie/Cub, CBM, Precio, Inv:

items_data = [
    # Page 1
    {
        "code": "13027",
        "name": "PISTOLA DE PINTAR MEGAPRO",
        "sku": "MP-PDP110V",
        "empaque": "8",
        "pie_cub": "0.0000",
        "peso": "14.700KG",
        "cbm": "0.120",
        "precio": 13.93,
        "inv": "400 PZA",
        "stock": 400
    },
    # Page 2
    {
        "code": "11431",
        "name": "ABRAZADERA DE ACERO CON MANIJA 1 PULG. MEGAPRO",
        "sku": "MP-ABCP1",
        "empaque": "100",
        "pie_cub": "0.8677",
        "peso": "8.300KG",
        "cbm": "0.025",
        "precio": 0.41,
        "inv": "500 PZA",
        "stock": 500
    },
    {
        "code": "11433",
        "name": "ABRAZADERA DE ACERO CON MANIJA 1.1/4 PULG. MEGAPRO",
        "sku": "MP-ABCP114",
        "empaque": "50",
        "pie_cub": "0.5463",
        "peso": "4.800KG",
        "cbm": "0.016",
        "precio": 0.46,
        "inv": "350 PZA",
        "stock": 350
    },
    {
        "code": "11434",
        "name": "ABRAZADERA DE ACERO CON MANIJA 1.3/4 PULG. MEGAPRO",
        "sku": "MP-ABCP134",
        "empaque": "50",
        "pie_cub": "0.7713",
        "peso": "5.300KG",
        "cbm": "0.022",
        "precio": 0.51,
        "inv": "350 PZA",
        "stock": 350
    },
    {
        "code": "11432",
        "name": "ABRAZADERA DE ACERO CON MANIJA 1/16 PULG. MEGAPRO",
        "sku": "MP-ABCP116",
        "empaque": "50",
        "pie_cub": "0.5463",
        "peso": "4.600KG",
        "cbm": "0.016",
        "precio": 0.42,
        "inv": "350 PZA",
        "stock": 350
    },
    {
        "code": "11428",
        "name": "ABRAZADERA DE ACERO CON MANIJA 1/2 PULG. MEGAPRO",
        "sku": "MP-ABCP12",
        "empaque": "100",
        "pie_cub": "0.6427",
        "peso": "7.600KG",
        "cbm": "0.018",
        "precio": 0.40,
        "inv": "500 PZA",
        "stock": 500
    },
    {
        "code": "11435",
        "name": "ABRAZADERA DE ACERO CON MANIJA 2 PULG. MEGAPRO",
        "sku": "MP-ABCP2",
        "empaque": "50",
        "pie_cub": "0.8677",
        "peso": "5.700KG",
        "cbm": "0.025",
        "precio": 0.54,
        "inv": "250 PZA",
        "stock": 250
    },
    {
        "code": "11430",
        "name": "ABRAZADERA DE ACERO CON MANIJA 3/4 PULG. MEGAPRO",
        "sku": "MP-ABCP34",
        "empaque": "100",
        "pie_cub": "0.7713",
        "peso": "8.000KG",
        "cbm": "0.022",
        "precio": 0.39,
        "inv": "700 PZA",
        "stock": 700
    },
    {
        "code": "11429",
        "name": "ABRAZADERA DE ACERO CON MANIJA 5/8 PULG. MEGAPRO",
        "sku": "MP-ABCP58",
        "empaque": "100",
        "pie_cub": "0.6427",
        "peso": "7.800KG",
        "cbm": "0.018",
        "precio": 0.38,
        "inv": "700 PZA",
        "stock": 700
    },
    {
        "code": "11831",
        "name": "ALAMBRE DE PUA GALVANIZADO 1.6MM X 300 MT MEGAPRO",
        "sku": "MP-300",
        "empaque": "1",
        "pie_cub": "0.6339",
        "peso": "14.100KG",
        "cbm": "0.018",
        "precio": 18.87,
        "inv": "429 PZA",
        "stock": 429
    },
    # Page 3
    {
        "code": "10622",
        "name": "ALAMBRE GALVANIZADO 700 GR MEGAPRO",
        "sku": "MP-AG001",
        "empaque": "20",
        "pie_cub": "0.3531",
        "peso": "14.000KG",
        "cbm": "0.010",
        "precio": 0.91,
        "inv": "20 ROLL",
        "stock": 20
    },
    {
        "code": "11458",
        "name": "ALICATE 10 PULG. MEGAPRO",
        "sku": "MP-ALEN-10P",
        "empaque": "36",
        "pie_cub": "0.9202",
        "peso": "11.920KG",
        "cbm": "0.026",
        "precio": 3.45,
        "inv": "468 PZA",
        "stock": 468
    },
    {
        "code": "11445",
        "name": "ALICATE 7 PULG. MEGAPRO",
        "sku": "MP-ALC90-7P",
        "empaque": "60",
        "pie_cub": "0.8456",
        "peso": "11.920KG",
        "cbm": "0.024",
        "precio": 1.51,
        "inv": "360 PZA",
        "stock": 360
    },
    {
        "code": "11443",
        "name": "ALICATE DE PRESION 10 PULG. MEGAPRO",
        "sku": "MP-ALP-10PG",
        "empaque": "36",
        "pie_cub": "0.9689",
        "peso": "18.950KG",
        "cbm": "0.027",
        "precio": 2.17,
        "inv": "900 PZA",
        "stock": 900
    },
    {
        "code": "11442",
        "name": "ALICATE DE PRESION 9 PULG. MEGAPRO",
        "sku": "MP-ALP-9P",
        "empaque": "36",
        "pie_cub": "0.8897",
        "peso": "17.900KG",
        "cbm": "0.025",
        "precio": 1.92,
        "inv": "864 PZA",
        "stock": 864
    },
    {
        "code": "13127",
        "name": "ASPEIRADORA 10 LITROS MEGAPRO",
        "sku": "MP-AP10L",
        "empaque": "1",
        "pie_cub": "0.0000",
        "peso": "2.300KG",
        "cbm": "0.024",
        "precio": 20.19,
        "inv": "600 PZA",
        "stock": 600
    },
    # Page 4
    {
        "code": "13128",
        "name": "ASPEIRADORA 12 LITROS MEGAPRO",
        "sku": "MP-AP12L",
        "empaque": "1",
        "pie_cub": "0.0000",
        "peso": "3.850KG",
        "cbm": "0.030",
        "precio": 25.25,
        "inv": "850 PZA",
        "stock": 850
    },
    {
        "code": "13129",
        "name": "ASPEIRADORA 15 LITROS MEGAPRO",
        "sku": "MP-AP15L",
        "empaque": "1",
        "pie_cub": "0.0000",
        "peso": "4.150KG",
        "cbm": "0.033",
        "precio": 27.80,
        "inv": "400 PZA",
        "stock": 400
    },
    {
        "code": "11424",
        "name": "BALANZA COLGANTE 200 KG MEGAPRO",
        "sku": "MG-HBM200",
        "empaque": "10",
        "pie_cub": "2.6931",
        "peso": "18.480KG",
        "cbm": "0.076",
        "precio": 24.50,
        "inv": "80 PZA",
        "stock": 80
    },
    {
        "code": "11425",
        "name": "BALANZA COLGANTE 300 KG MEGAPRO",
        "sku": "MG-HBM30",
        "empaque": "10",
        "pie_cub": "2.6931",
        "peso": "18.450KG",
        "cbm": "0.076",
        "precio": 26.50,
        "inv": "80 PZA",
        "stock": 80
    },
    {
        "code": "11426",
        "name": "BALANZA COLGANTE 500 KG MEGAPRO",
        "sku": "MG-HBM500",
        "empaque": "10",
        "pie_cub": "2.6931",
        "peso": "18.450KG",
        "cbm": "0.076",
        "precio": 28.50,
        "inv": "80 PZA",
        "stock": 80
    },
    {
        "code": "11237",
        "name": "BALASTRO MULTI WATT 8-24 W MEGAPRO",
        "sku": "MP-LDDVR324",
        "empaque": "200",
        "pie_cub": "1.8646",
        "peso": "7.160KG",
        "cbm": "0.053",
        "precio": 0.49,
        "inv": "1400 PZA",
        "stock": 1400
    },
    {
        "code": "12933",
        "name": "BALDE EXPRIMIDOR MEGAPRO",
        "sku": "MP-EI24L9",
        "empaque": "1",
        "pie_cub": "0.0000",
        "peso": "5.150KG",
        "cbm": "0.070",
        "precio": 24.90,
        "inv": "370 PZA",
        "stock": 370
    },
    {
        "code": "12883",
        "name": "BARRA DE TIERRA",
        "sku": "MP-PROW58",
        "empaque": "500",
        "pie_cub": "0.0000",
        "peso": "15.000KG",
        "cbm": "0.420",
        "precio": 5.10,
        "inv": "2 PZA",
        "stock": 2
    },
    {
        "code": "11222",
        "name": "BASE DOBLE PARA TUBO LED T8 MEGAPRO",
        "sku": "MP-BTL2T120",
        "empaque": "30",
        "pie_cub": "0.7769",
        "peso": "3.300KG",
        "cbm": "0.022",
        "precio": 0.75,
        "inv": "1110 PZA",
        "stock": 1110
    },
    # Page 5
    {
        "code": "12896",
        "name": "BASE PARA ESMERIL MEGAPRO",
        "sku": "MP-AMAG1",
        "empaque": "36",
        "pie_cub": "0.0000",
        "peso": "24.000KG",
        "cbm": "0.112",
        "precio": 3.27,
        "inv": "108 PZA",
        "stock": 108
    },
    {
        "code": "11223",
        "name": "BASE SENCILLA PARA TUBO LED T8 MEGAPRO",
        "sku": "MG-BTL1T120H",
        "empaque": "30",
        "pie_cub": "1.4832",
        "peso": "6.100KG",
        "cbm": "0.042",
        "precio": 0.76,
        "inv": "1110 PZA",
        "stock": 1110
    },
    {
        "code": "11732",
        "name": "BENJAMI DE CADENA MEGAPRO",
        "sku": "MP-PLCC1",
        "empaque": "120",
        "pie_cub": "1.5643",
        "peso": "10.110KG",
        "cbm": "0.044",
        "precio": 0.34,
        "inv": "3040 PZA",
        "stock": 3040
    },
    {
        "code": "13017",
        "name": "BENJAMI MULTIPLE MEGAPRO",
        "sku": "MP-B181TS",
        "empaque": "300",
        "pie_cub": "0.0000",
        "peso": "6.910KG",
        "cbm": "0.044",
        "precio": 0.17,
        "inv": "1500 PZA",
        "stock": 1500
    },
    {
        "code": "10298",
        "name": "BISAGRA ARMILLAR 2 PULG MEGAPRO",
        "sku": "MP-BPS002",
        "empaque": "600",
        "pie_cub": "0.2649",
        "peso": "16.767KG",
        "cbm": "0.008",
        "precio": 0.19,
        "inv": "46200 PZA",
        "stock": 46200
    },
    {
        "code": "10299",
        "name": "BISAGRA ARMILLAR 3 PULG MEGAPRO",
        "sku": "MP-BPS003",
        "empaque": "400",
        "pie_cub": "0.2649",
        "peso": "20.700KG",
        "cbm": "0.008",
        "precio": 0.23,
        "inv": "15200 PZA",
        "stock": 15200
    },
    {
        "code": "10300",
        "name": "BISAGRA ARMILLAR 4 PULG MEGAPRO",
        "sku": "MP-BPS004",
        "empaque": "200",
        "pie_cub": "0.2649",
        "peso": "22.600KG",
        "cbm": "0.008",
        "precio": 0.36,
        "inv": "8400 PZA",
        "stock": 8400
    },
    {
        "code": "10301",
        "name": "BISAGRA ARMILLAR 5 PULG MEGAPRO",
        "sku": "MP-BPS005",
        "empaque": "125",
        "pie_cub": "0.2649",
        "peso": "20.335KG",
        "cbm": "0.008",
        "precio": 0.43,
        "inv": "11125 PZA",
        "stock": 11125
    },
    {
        "code": "10654",
        "name": "BOMBILLO 6W 90-100LM/W E27 MEGAPRO",
        "sku": "MP-LAMPG45-E27",
        "empaque": "100",
        "pie_cub": "0.7310",
        "peso": "2.300KG",
        "cbm": "0.021",
        "precio": 0.33,
        "inv": "5900 PZA",
        "stock": 5900
    },
    # Page 6
    {
        "code": "10655",
        "name": "BOMBILLO AC85-265V 6W 90-100LM/W E14 MEGAPRO",
        "sku": "MP-LAMPG45-E14",
        "empaque": "100",
        "pie_cub": "0.7310",
        "peso": "2.300KG",
        "cbm": "0.021",
        "precio": 0.33,
        "inv": "6300 PZA",
        "stock": 6300
    },
    {
        "code": "12540",
        "name": "BOMBILLO 12 WATT MEGAPRO",
        "sku": "MP-LAMP12W",
        "empaque": "50",
        "pie_cub": "1.0418",
        "peso": "3.700KG",
        "cbm": "0.030",
        "precio": 0.46,
        "inv": "3750 PZA",
        "stock": 3750
    },
    {
        "code": "11239",
        "name": "BOMBILLO 9 WAT MEGAPRO",
        "sku": "MP-LAMPS9W",
        "empaque": "100",
        "pie_cub": "1.6174",
        "peso": "3.300KG",
        "cbm": "0.046",
        "precio": 0.42,
        "inv": "2600 PZA",
        "stock": 2600
    },
    {
        "code": "12531",
        "name": "BOMBILLO INDUSTRIAL DOS TONO 150 WATT MEGAPRO",
        "sku": "MP-150MWB",
        "empaque": "20",
        "pie_cub": "6.7539",
        "peso": "9.850KG",
        "cbm": "0.191",
        "precio": 6.22,
        "inv": "200 PZA",
        "stock": 200
    },
    {
        "code": "12529",
        "name": "BOMBILLO INDUSTRIAL DOS TONO 80 WATT MEGAPRO",
        "sku": "MP-80WBMV",
        "empaque": "30",
        "pie_cub": "4.8298",
        "peso": "8.000KG",
        "cbm": "0.137",
        "precio": 3.26,
        "inv": "120 PZA",
        "stock": 120
    },
    {
        "code": "10354",
        "name": "BOMBILLO LED 12 WATT MEGAPRO",
        "sku": "MP-LAMPP12W",
        "empaque": "100",
        "pie_cub": "2.9700",
        "peso": "5.820KG",
        "cbm": "0.084",
        "precio": 0.37,
        "inv": "5600 PZA",
        "stock": 5600
    },
    {
        "code": "10355",
        "name": "BOMBILLO LED 15 WATT MEGAPRO",
        "sku": "MP-LAMPP15W",
        "empaque": "100",
        "pie_cub": "3.7963",
        "peso": "6.850KG",
        "cbm": "0.108",
        "precio": 0.44,
        "inv": "2100 PZA",
        "stock": 2100
    },
    {
        "code": "10350",
        "name": "BOMBILLO LED 3 WATT MEGAPRO",
        "sku": "MP-LAMPP3W",
        "empaque": "100",
        "pie_cub": "0.7652",
        "peso": "2.280KG",
        "cbm": "0.022",
        "precio": 0.20,
        "inv": "900 PZA",
        "stock": 900
    },
    {
        "code": "10351",
        "name": "BOMBILLO LED 5 WATT MEGAPRO",
        "sku": "MP-LAMPP5W",
        "empaque": "100",
        "pie_cub": "1.0359",
        "peso": "2.950KG",
        "cbm": "0.029",
        "precio": 0.26,
        "inv": "1800 PZA",
        "stock": 1800
    },
    # Page 7
    {
        "code": "10352",
        "name": "BOMBILLO LED 7 WATT MEGAPRO",
        "sku": "MP-LAMPP7W",
        "empaque": "100",
        "pie_cub": "1.5009",
        "peso": "3.930KG",
        "cbm": "0.043",
        "precio": 0.29,
        "inv": "7800 PZA",
        "stock": 7800
    },
    {
        "code": "10353",
        "name": "BOMBILLO LED 9 WATT MEGAPRO",
        "sku": "MP-LAMPP9W",
        "empaque": "100",
        "pie_cub": "2.0483",
        "peso": "4.950KG",
        "cbm": "0.058",
        "precio": 0.34,
        "inv": "4800 PZA",
        "stock": 4800
    },
    {
        "code": "11221",
        "name": "BOMBILLO T8 120 CM MEGAPRO",
        "sku": "MP-TLT8120CM",
        "empaque": "50",
        "pie_cub": "1.1772",
        "peso": "10.500KG",
        "cbm": "0.033",
        "precio": 0.88,
        "inv": "550 PZA",
        "stock": 550
    },
    {
        "code": "11220",
        "name": "BOMBILLO T8 60 CM MEGAPRO",
        "sku": "MP-TLT860CM",
        "empaque": "50",
        "pie_cub": "1.1772",
        "peso": "11.000KG",
        "cbm": "0.033",
        "precio": 0.65,
        "inv": "550 PZA",
        "stock": 550
    },
    {
        "code": "11216",
        "name": "BOMBILLO VENTILADOR MEGAPRO",
        "sku": "MP-BLTV001",
        "empaque": "20",
        "pie_cub": "4.5399",
        "peso": "10.000KG",
        "cbm": "0.129",
        "precio": 3.60,
        "inv": "440 PZA",
        "stock": 440
    },
    {
        "code": "11217",
        "name": "BOMBILLO VENTILADOR MEGAPRO",
        "sku": "MP-BLTV002",
        "empaque": "24",
        "pie_cub": "3.5479",
        "peso": "14.000KG",
        "cbm": "0.101",
        "precio": 6.28,
        "inv": "288 PZA",
        "stock": 288
    },
    {
        "code": "10658",
        "name": "BOMBILLOS AC85-265V ,15W 90-100LM/W MEGAPRO",
        "sku": "MP-LAMPS15W",
        "empaque": "100",
        "pie_cub": "2.4367",
        "peso": "4.400KG",
        "cbm": "0.069",
        "precio": 0.63,
        "inv": "50 PZA",
        "stock": 50
    },
    {
        "code": "10670",
        "name": "BOMBILLOS AC85-265V ,15W 90-100LM/W MEGAPRO",
        "sku": "MP-T70L15W",
        "empaque": "100",
        "pie_cub": "2.4014",
        "peso": "5.300KG",
        "cbm": "0.068",
        "precio": 0.52,
        "inv": "4800 PZA",
        "stock": 4800
    },
    {
        "code": "10659",
        "name": "BOMBILLOS AC85-265V ,18W 90-100LM/W MEGAPRO",
        "sku": "MP-LAMPS18W",
        "empaque": "100",
        "pie_cub": "3.3831",
        "peso": "5.700KG",
        "cbm": "0.096",
        "precio": 0.77,
        "inv": "100 PZA",
        "stock": 100
    },
    # Page 8
    {
        "code": "10671",
        "name": "BOMBILLOS AC85-265V ,20W 90-100LM/W MEGAPRO",
        "sku": "MP-T80L20W",
        "empaque": "100",
        "pie_cub": "3.4608",
        "peso": "6.750KG",
        "cbm": "0.098",
        "precio": 0.69,
        "inv": "5300 PZA",
        "stock": 5300
    },
    {
        "code": "10672",
        "name": "BOMBILLOS AC85-265V ,30W 90-100LM/W MEGAPRO",
        "sku": "MP-T100L30W",
        "empaque": "50",
        "pie_cub": "3.0759",
        "peso": "5.050KG",
        "cbm": "0.087",
        "precio": 0.94,
        "inv": "3150 PZA",
        "stock": 3150
    },
    {
        "code": "10662",
        "name": "BOMBILLOS AC85-265V ,3W 90-100LM/W MEGAPRO",
        "sku": "MP-LAPAC853W",
        "empaque": "100",
        "pie_cub": "0.4473",
        "peso": "2.580KG",
        "cbm": "0.013",
        "precio": 0.42,
        "inv": "1000 PZA",
        "stock": 1000
    },
    {
        "code": "10673",
        "name": "BOMBILLOS AC85-265V ,40W 90-100LM/W MEGAPRO",
        "sku": "MP-T112L40W",
        "empaque": "50",
        "pie_cub": "4.0788",
        "peso": "8.350KG",
        "cbm": "0.116",
        "precio": 1.30,
        "inv": "2646 PZA",
        "stock": 2646
    },
    {
        "code": "10660",
        "name": "BOMBILLOS AC85-265V ,5W 90-100LM/W E14 MEGAPRO",
        "sku": "MP-LAPC37E14",
        "empaque": "100",
        "pie_cub": "0.6498",
        "peso": "2.900KG",
        "cbm": "0.018",
        "precio": 0.35,
        "inv": "2000 PZA",
        "stock": 2000
    },
    {
        "code": "10661",
        "name": "BOMBILLOS AC85-265V ,5W 90-100LM/W E27 MEGAPRO",
        "sku": "MP-LAPC375E27",
        "empaque": "100",
        "pie_cub": "0.6498",
        "peso": "2.900KG",
        "cbm": "0.018",
        "precio": 0.35,
        "inv": "2000 PZA",
        "stock": 2000
    },
    {
        "code": "10663",
        "name": "BOMBILLOS AC85-265V ,5W 90-100LM/W MEGAPRO",
        "sku": "MP-LAPAC855W",
        "empaque": "100",
        "pie_cub": "0.6710",
        "peso": "3.600KG",
        "cbm": "0.019",
        "precio": 0.51,
        "inv": "700 PZA",
        "stock": 700
    },
    {
        "code": "10668",
        "name": "BOMBILLOS AC85-265V ,5W 90-100LM/W MEGAPRO",
        "sku": "MP-T50L5W",
        "empaque": "100",
        "pie_cub": "1.0453",
        "peso": "2.900KG",
        "cbm": "0.030",
        "precio": 0.35,
        "inv": "2300 PZA",
        "stock": 2300
    },
    {
        "code": "10656",
        "name": "BOMBILLOS AC85-265V ,7W 90-100LM/W MEGAPRO",
        "sku": "MP-LAMPS7W",
        "empaque": "100",
        "pie_cub": "1.7504",
        "peso": "3.587KG",
        "cbm": "0.050",
        "precio": 0.37,
        "inv": "700 PZA",
        "stock": 700
    },
    # Page 9
    {
        "code": "10664",
        "name": "BOMBILLOS AC85-265V ,7W 90-100LM/W MEGAPRO",
        "sku": "MP-LAPAC857W",
        "empaque": "100",
        "pie_cub": "0.6710",
        "peso": "3.600KG",
        "cbm": "0.019",
        "precio": 0.54,
        "inv": "800 PZA",
        "stock": 800
    },
    {
        "code": "10665",
        "name": "BOMBILLOS AC85-265V ,9W 90-100LM/W MEGAPRO",
        "sku": "MP-LAPAC859W",
        "empaque": "100",
        "pie_cub": "0.6710",
        "peso": "3.600KG",
        "cbm": "0.019",
        "precio": 0.63,
        "inv": "800 PZA",
        "stock": 800
    },
    {
        "code": "10669",
        "name": "BOMBILLOS AC85-265V ,9W 90-100LM/W MEGAPRO",
        "sku": "MP-T60L9W",
        "empaque": "100",
        "pie_cub": "1.6209",
        "peso": "4.100KG",
        "cbm": "0.046",
        "precio": 0.44,
        "inv": "5800 PZA",
        "stock": 5800
    },
    {
        "code": "13018",
        "name": "BOQUILLA PARA BOMBILLO MEGAPRO",
        "sku": "MP-BU227E",
        "empaque": "300",
        "pie_cub": "0.0000",
        "peso": "7.760KG",
        "cbm": "0.044",
        "precio": 0.20,
        "inv": "1500 PZA",
        "stock": 1500
    },
    {
        "code": "11706",
        "name": "BRAZO PARA PUERTA HIDRAULICO 25-45 KG MEGAPRO",
        "sku": "MP-BH45K",
        "empaque": "10",
        "pie_cub": "0.5531",
        "peso": "9.000KG",
        "cbm": "0.016",
        "precio": 4.87,
        "inv": "540 PZA",
        "stock": 540
    },
    {
        "code": "11707",
        "name": "BRAZO PARA PUERTA HIDRAULICO 45-65 KG MEGAPRO",
        "sku": "MP-BH65K",
        "empaque": "10",
        "pie_cub": "0.5531",
        "peso": "10.500KG",
        "cbm": "0.016",
        "precio": 5.32,
        "inv": "360 PZA",
        "stock": 360
    },
    {
        "code": "11708",
        "name": "BRAZO PARA PUERTA HIDRAULICO 65-85 KG MEGAPRO",
        "sku": "MP-BH85K",
        "empaque": "10",
        "pie_cub": "0.8055",
        "peso": "15.500KG",
        "cbm": "0.023",
        "precio": 8.50,
        "inv": "730 PZA",
        "stock": 730
    },
    {
        "code": "10562",
        "name": "BRECKER THQC 1 TACO 20 AMP MEGAPRO",
        "sku": "MP-EB003-20A",
        "empaque": "100",
        "pie_cub": "0.9535",
        "peso": "17.840KG",
        "cbm": "0.027",
        "precio": 1.25,
        "inv": "1200 PZA",
        "stock": 1200
    },
    {
        "code": "10563",
        "name": "BRECKER THQC 1 TACO 30 AMP MEGAPRO",
        "sku": "MP-EB003-30A",
        "empaque": "100",
        "pie_cub": "0.9535",
        "peso": "16.860KG",
        "cbm": "0.027",
        "precio": 1.25,
        "inv": "1700 PZA",
        "stock": 1700
    },
    # Page 10
    {
        "code": "10564",
        "name": "BRECKER THQC 1 TACO 40 AMP MEGAPRO",
        "sku": "MP-EB003-40A",
        "empaque": "100",
        "pie_cub": "0.9535",
        "peso": "16.880KG",
        "cbm": "0.027",
        "precio": 1.25,
        "inv": "1700 PZA",
        "stock": 1700
    },
    {
        "code": "10565",
        "name": "BRECKER THQC 1 TACO 50 AMP MEGAPRO",
        "sku": "MP-EB003-50A",
        "empaque": "100",
        "pie_cub": "0.9535",
        "peso": "17.760KG",
        "cbm": "0.027",
        "precio": 1.25,
        "inv": "1000 PZA",
        "stock": 1000
    },
    {
        "code": "10566",
        "name": "BRECKER THQC 1 TACO 60 AMP MEGAPRO",
        "sku": "MP-EB003-60A",
        "empaque": "100",
        "pie_cub": "0.9535",
        "peso": "17.640KG",
        "cbm": "0.027",
        "precio": 1.25,
        "inv": "1700 PZA",
        "stock": 1700
    },
    {
        "code": "10569",
        "name": "BRECKER THQC 2 TACO 40 AMP MEGAPRO",
        "sku": "MP-EB004-40A",
        "empaque": "50",
        "pie_cub": "0.9535",
        "peso": "18.160KG",
        "cbm": "0.027",
        "precio": 2.63,
        "inv": "100 PZA",
        "stock": 100
    },
    {
        "code": "10570",
        "name": "BRECKER THQC 2 TACO 50 AMP MEGAPRO",
        "sku": "MP-EB004-50A",
        "empaque": "50",
        "pie_cub": "0.9535",
        "peso": "18.160KG",
        "cbm": "0.027",
        "precio": 2.63,
        "inv": "750 PZA",
        "stock": 750
    },
    {
        "code": "10571",
        "name": "BRECKER THQC 2 TACO 60 AMP MEGAPRO",
        "sku": "MP-EB004-60A",
        "empaque": "50",
        "pie_cub": "0.9535",
        "peso": "18.200KG",
        "cbm": "0.027",
        "precio": 2.63,
        "inv": "650 PZA",
        "stock": 650
    },
    {
        "code": "10552",
        "name": "BRECKER THQL 1 TACO 20 AMP MEGAPRO",
        "sku": "MP-EB001-20A",
        "empaque": "100",
        "pie_cub": "0.8052",
        "peso": "12.620KG",
        "cbm": "0.023",
        "precio": 0.82,
        "inv": "4000 PZA",
        "stock": 4000
    },
    {
        "code": "10553",
        "name": "BRECKER THQL 1 TACO 30 AMP MEGAPRO",
        "sku": "MP-EB001-30A",
        "empaque": "100",
        "pie_cub": "0.8052",
        "peso": "12.640KG",
        "cbm": "0.023",
        "precio": 0.82,
        "inv": "4000 PZA",
        "stock": 4000
    },
    {
        "code": "10555",
        "name": "BRECKER THQL 1 TACO 50 AMP MEGAPRO",
        "sku": "MP-EB001-50A",
        "empaque": "100",
        "pie_cub": "0.8052",
        "peso": "12.740KG",
        "cbm": "0.023",
        "precio": 0.86,
        "inv": "1700 PZA",
        "stock": 1700
    },
    # Page 11
    {
        "code": "10556",
        "name": "BRECKER THQL 1 TACO 60 AMP MEGAPRO",
        "sku": "MP-EB001-60A",
        "empaque": "100",
        "pie_cub": "0.8052",
        "peso": "12.780KG",
        "cbm": "0.023",
        "precio": 0.86,
        "inv": "1500 PZA",
        "stock": 1500
    },
    {
        "code": "10560",
        "name": "BRECKER THQL 2 TACO 50 AMP MEGAPRO",
        "sku": "MP-EB002-50A",
        "empaque": "50",
        "pie_cub": "0.8052",
        "peso": "13.260KG",
        "cbm": "0.023",
        "precio": 1.73,
        "inv": "850 PZA",
        "stock": 850
    },
    {
        "code": "10561",
        "name": "BRECKER THQL 2 TACO 60 AMP MEGAPRO",
        "sku": "MP-EB002-60A",
        "empaque": "50",
        "pie_cub": "0.8052",
        "peso": "13.160KG",
        "cbm": "0.023",
        "precio": 1.73,
        "inv": "750 PZA",
        "stock": 750
    },
    {
        "code": "10921",
        "name": "BROCAS PARA CONCRETO MEGAPRO",
        "sku": "MP-SMCM5PZ",
        "empaque": "200",
        "pie_cub": "0.9358",
        "peso": "20.800KG",
        "cbm": "0.027",
        "precio": 0.69,
        "inv": "2200 SET",
        "stock": 2200
    },
    {
        "code": "11289",
        "name": "BROCHA 1 PULGADA MEGAPRO",
        "sku": "MP-BPPD94",
        "empaque": "600",
        "pie_cub": "2.3669",
        "peso": "16.100KG",
        "cbm": "0.067",
        "precio": 0.19,
        "inv": "600 PZA",
        "stock": 600
    },
    {
        "code": "11290",
        "name": "BROCHA 3 PULGADA MEGAPRO",
        "sku": "MP-BPPD98",
        "empaque": "360",
        "pie_cub": "4.0877",
        "peso": "27.000KG",
        "cbm": "0.116",
        "precio": 0.55,
        "inv": "720 PZA",
        "stock": 720
    },
    {
        "code": "11400",
        "name": "CADENA GALVANIZADA 1/2 PULG. MEGAPRO",
        "sku": "MP-CG25",
        "empaque": "1",
        "pie_cub": "3.3902",
        "peso": "25.000KG",
        "cbm": "0.096",
        "precio": 31.94,
        "inv": "1 PZA",
        "stock": 1
    },
    {
        "code": "11404",
        "name": "CADENA GALVANIZADA 1/4 PULG. MEGAPRO",
        "sku": "MP-CG14",
        "empaque": "1",
        "pie_cub": "3.3902",
        "peso": "25.000KG",
        "cbm": "0.096",
        "precio": 31.94,
        "inv": "1 PZA",
        "stock": 1
    },
    {
        "code": "11401",
        "name": "CADENA GALVANIZADA 3/16 PULG. MEGAPRO",
        "sku": "MP-CG316",
        "empaque": "1",
        "pie_cub": "3.3902",
        "peso": "25.000KG",
        "cbm": "0.096",
        "precio": 31.94,
        "inv": "1 PZA",
        "stock": 1
    },
    # Page 12
    {
        "code": "11399",
        "name": "CADENA GALVANIZADA 3/8 PULG. MEGAPRO",
        "sku": "MP-CG38",
        "empaque": "1",
        "pie_cub": "5.8847",
        "peso": "151.200KG",
        "cbm": "0.167",
        "precio": 35.83,
        "inv": "1 PZA",
        "stock": 1
    },
    {
        "code": "11402",
        "name": "CADENA GALVANIZADA 5/16 PULG. MEGAPRO",
        "sku": "MP-CG0516",
        "empaque": "1",
        "pie_cub": "3.3902",
        "peso": "25.000KG",
        "cbm": "0.096",
        "precio": 31.94,
        "inv": "1 PZA",
        "stock": 1
    },
    {
        "code": "11403",
        "name": "CADENA GALVANIZADA 5/32 PULG. MEGAPRO",
        "sku": "MP-CG532",
        "empaque": "1",
        "pie_cub": "3.3902",
        "peso": "25.000KG",
        "cbm": "0.096",
        "precio": 34.23,
        "inv": "1 PZA",
        "stock": 1
    },
    {
        "code": "11484",
        "name": "CADENA PARA MASCOTA 1.55MM*1.8MT MEGAPRO",
        "sku": "MP-CC15",
        "empaque": "180",
        "pie_cub": "1.3581",
        "peso": "20.900KG",
        "cbm": "0.039",
        "precio": 0.48,
        "inv": "1 PZA",
        "stock": 1
    },
    {
        "code": "11485",
        "name": "CADENA PARA MASCOTA 1.7MM*1.8MT MEGAPRO",
        "sku": "MP-CC17",
        "empaque": "180",
        "pie_cub": "1.3581",
        "peso": "24.600KG",
        "cbm": "0.039",
        "precio": 0.53,
        "inv": "1 PZA",
        "stock": 1
    },
    {
        "code": "11488",
        "name": "CADENA PARA MASCOTA 2.3MM*1.8MT MEGAPRO",
        "sku": "MP-CC23",
        "empaque": "120",
        "pie_cub": "1.6188",
        "peso": "27.800KG",
        "cbm": "0.046",
        "precio": 0.74,
        "inv": "6 PZA",
        "stock": 6
    },
    # Page 13
    {
        "code": "11489",
        "name": "CADENA PARA MASCOTA 2.5MM*1.8MT MEGAPRO",
        "sku": "MP-CC25",
        "empaque": "120",
        "pie_cub": "1.6527",
        "peso": "33.700KG",
        "cbm": "0.047",
        "precio": 0.78,
        "inv": "22 PZA",
        "stock": 22
    },
    {
        "code": "11490",
        "name": "CADENA PARA MASCOTA 2.8MM*1.8MT MEGAPRO",
        "sku": "MP-CC28",
        "empaque": "60",
        "pie_cub": "1.0100",
        "peso": "19.600KG",
        "cbm": "0.029",
        "precio": 0.88,
        "inv": "24 PZA",
        "stock": 24
    },
    {
        "code": "11491",
        "name": "CADENA PARA MASCOTA 3.1MM*1.8MT MEGAPRO",
        "sku": "MP-CC3",
        "empaque": "60",
        "pie_cub": "1.1491",
        "peso": "24.000KG",
        "cbm": "0.033",
        "precio": 0.98,
        "inv": "24 PZA",
        "stock": 24
    },
    {
        "code": "12891",
        "name": "CAJETIN 2X4 METALICO",
        "sku": "BOX-M5-1-1-2-2X4",
        "empaque": "50",
        "pie_cub": "0.0000",
        "peso": "8.000KG",
        "cbm": "0.020",
        "precio": 0.47,
        "inv": "2000 PZA",
        "stock": 2000
    },
    {
        "code": "11071",
        "name": "CAJETIN 4X2 SOBREPONER REFORZADO MEGAPRO",
        "sku": "MP-CP42",
        "empaque": "165",
        "pie_cub": "2.5403",
        "peso": "13.200KG",
        "cbm": "0.072",
        "precio": 0.34,
        "inv": "12 PZA",
        "stock": 12
    },
    {
        "code": "10809",
        "name": "CAJETIN CUADRADO MEGAPRO",
        "sku": "MP-CAJPVC-4X4",
        "empaque": "200",
        "pie_cub": "4.1954",
        "peso": "16.050KG",
        "cbm": "0.119",
        "precio": 0.32,
        "inv": "14400 PZA",
        "stock": 14400
    },
    {
        "code": "12895",
        "name": "CALENTADOR DE AGUA MEGAPRO",
        "sku": "MP-H110VP",
        "empaque": "100",
        "pie_cub": "0.0000",
        "peso": "19.300KG",
        "cbm": "0.046",
        "precio": 1.88,
        "inv": "1900 PZA",
        "stock": 1900
    },
    {
        "code": "11482",
        "name": "CAMILLA PARA MECANICO MEGAPRO",
        "sku": "MP-CAMTA40P",
        "empaque": "1",
        "pie_cub": "1.6368",
        "peso": "5.200KG",
        "cbm": "0.046",
        "precio": 14.77,
        "inv": "6 PZA",
        "stock": 6
    },
    {
        "code": "11306",
        "name": "CANDADO 20 MM MEGAPRO",
        "sku": "MP-CHD020",
        "empaque": "600",
        "pie_cub": "0.4324",
        "peso": "17.400KG",
        "cbm": "0.012",
        "precio": 0.29,
        "inv": "5400 PZA",
        "stock": 5400
    },
    # Page 14
    {
        "code": "11299",
        "name": "CANDADO 20 MM MEGAPRO",
        "sku": "MP-CND20",
        "empaque": "600",
        "pie_cub": "0.4324",
        "peso": "17.400KG",
        "cbm": "0.012",
        "precio": 0.29,
        "inv": "7800 PZA",
        "stock": 7800
    },
    {
        "code": "11300",
        "name": "CANDADO 25 MM MEGAPRO",
        "sku": "MP-CND250",
        "empaque": "600",
        "pie_cub": "0.6317",
        "peso": "27.000KG",
        "cbm": "0.018",
        "precio": 0.32,
        "inv": "6000 PZA",
        "stock": 6000
    },
    {
        "code": "11252",
        "name": "CANDADO 25MM MEGAPRO",
        "sku": "MP-CHD250",
        "empaque": "600",
        "pie_cub": "0.6317",
        "peso": "26.000KG",
        "cbm": "0.018",
        "precio": 0.32,
        "inv": "7200 PZA",
        "stock": 7200
    },
    {
        "code": "11307",
        "name": "CANDADO 32 MM MEGAPRO",
        "sku": "MP-CHD3213",
        "empaque": "240",
        "pie_cub": "0.4186",
        "peso": "16.880KG",
        "cbm": "0.012",
        "precio": 0.34,
        "inv": "3360 PZA",
        "stock": 3360
    },
    {
        "code": "11301",
        "name": "CANDADO 32 MM MEGAPRO",
        "sku": "MP-CND320",
        "empaque": "240",
        "pie_cub": "0.4186",
        "peso": "16.860KG",
        "cbm": "0.012",
        "precio": 0.35,
        "inv": "4080 PZA",
        "stock": 4080
    },
    {
        "code": "11308",
        "name": "CANDADO 38 MM MEGAPRO",
        "sku": "MP-CHD3815",
        "empaque": "240",
        "pie_cub": "0.6159",
        "peso": "27.900KG",
        "cbm": "0.017",
        "precio": 0.42,
        "inv": "3360 PZA",
        "stock": 3360
    },
    {
        "code": "11302",
        "name": "CANDADO 38 MM MEGAPRO",
        "sku": "MP-CND0380",
        "empaque": "240",
        "pie_cub": "0.6159",
        "peso": "27.920KG",
        "cbm": "0.017",
        "precio": 0.43,
        "inv": "6960 PZA",
        "stock": 6960
    },
    {
        "code": "11309",
        "name": "CANDADO 50 MM MEGAPRO",
        "sku": "MP-CHD5018",
        "empaque": "120",
        "pie_cub": "0.5379",
        "peso": "26.240KG",
        "cbm": "0.015",
        "precio": 0.65,
        "inv": "1680 PZA",
        "stock": 1680
    },
    {
        "code": "11303",
        "name": "CANDADO 50 MM MEGAPRO",
        "sku": "MP-CND50",
        "empaque": "120",
        "pie_cub": "0.5379",
        "peso": "26.240KG",
        "cbm": "0.015",
        "precio": 0.65,
        "inv": "1800 PZA",
        "stock": 1800
    },
    # Page 15
    {
        "code": "11304",
        "name": "CANDADO 63 MM MEGAPRO",
        "sku": "MP-CND63",
        "empaque": "60",
        "pie_cub": "0.4401",
        "peso": "22.110KG",
        "cbm": "0.013",
        "precio": 0.94,
        "inv": "1020 PZA",
        "stock": 1020
    },
    {
        "code": "11311",
        "name": "CANDADO 75 MM MEGAPRO",
        "sku": "MP-CHD7521",
        "empaque": "60",
        "pie_cub": "0.6357",
        "peso": "33.520KG",
        "cbm": "0.018",
        "precio": 1.43,
        "inv": "780 PZA",
        "stock": 780
    },
    {
        "code": "11305",
        "name": "CANDADO 75 MM MEGAPRO",
        "sku": "MP-CND75",
        "empaque": "60",
        "pie_cub": "0.6357",
        "peso": "33.500KG",
        "cbm": "0.018",
        "precio": 1.43,
        "inv": "840 PZA",
        "stock": 840
    },
    {
        "code": "11295",
        "name": "CANDADO ANTICISALLA 100 MM MEGAPRO",
        "sku": "MP-CH-10010C",
        "empaque": "36",
        "pie_cub": "0.9567",
        "peso": "25.400KG",
        "cbm": "0.027",
        "precio": 2.60,
        "inv": "324 PZA",
        "stock": 324
    },
    {
        "code": "11247",
        "name": "CANDADO ANTICISALLA 100MM MEGAPRO",
        "sku": "MP-CH-10010M",
        "empaque": "36",
        "pie_cub": "0.9567",
        "peso": "24.320KG",
        "cbm": "0.027",
        "precio": 2.61,
        "inv": "288 PZA",
        "stock": 288
    },
    {
        "code": "11293",
        "name": "CANDADO ANTICISALLA 60 MM MEGAPRO",
        "sku": "MP-CH-6018C",
        "empaque": "48",
        "pie_cub": "0.7099",
        "peso": "17.720KG",
        "cbm": "0.020",
        "precio": 1.66,
        "inv": "384 PZA",
        "stock": 384
    },
    {
        "code": "11243",
        "name": "CANDADO ANTICISALLA 60MM MEGAPRO",
        "sku": "MP-CH-6018M",
        "empaque": "48",
        "pie_cub": "0.7099",
        "peso": "17.840KG",
        "cbm": "0.020",
        "precio": 1.67,
        "inv": "96 PZA",
        "stock": 96
    },
    {
        "code": "11249",
        "name": "CANDADO ANTICISALLA 60MM MEGAPRO",
        "sku": "MP-CHCA6018",
        "empaque": "48",
        "pie_cub": "0.7099",
        "peso": "17.720KG",
        "cbm": "0.020",
        "precio": 1.92,
        "inv": "432 PZA",
        "stock": 432
    },
    {
        "code": "11298",
        "name": "CANDADO ANTICISALLA 70 MM MEGAPRO",
        "sku": "MP-CHCA7019",
        "empaque": "48",
        "pie_cub": "1.2459",
        "peso": "23.000KG",
        "cbm": "0.035",
        "precio": 2.09,
        "inv": "144 PZA",
        "stock": 144
    },
    # Page 16
    {
        "code": "11241",
        "name": "CANDADO ANTICISALLA 70MM MEGAPRO",
        "sku": "MP-CH-7019C",
        "empaque": "48",
        "pie_cub": "1.2459",
        "peso": "22.000KG",
        "cbm": "0.035",
        "precio": 1.97,
        "inv": "192 PZA",
        "stock": 192
    },
    {
        "code": "11244",
        "name": "CANDADO ANTICISALLA 70MM MEGAPRO",
        "sku": "MP-CH-7019M",
        "empaque": "48",
        "pie_cub": "1.2459",
        "peso": "21.920KG",
        "cbm": "0.035",
        "precio": 1.97,
        "inv": "12 PZA",
        "stock": 12
    },
    {
        "code": "11296",
        "name": "CANDADO ANTICISALLA 74 MM MEGAPRO",
        "sku": "MP-CHCA74",
        "empaque": "24",
        "pie_cub": "0.6452",
        "peso": "17.860KG",
        "cbm": "0.018",
        "precio": 2.57,
        "inv": "336 PZA",
        "stock": 336
    },
    {
        "code": "11242",
        "name": "CANDADO ANTICISALLA 80MM MEGAPRO",
        "sku": "MP-CH-8019C",
        "empaque": "36",
        "pie_cub": "0.9567",
        "peso": "18.000KG",
        "cbm": "0.027",
        "precio": 2.13,
        "inv": "180 PZA",
        "stock": 180
    },
    {
        "code": "11245",
        "name": "CANDADO ANTICISALLA 80MM MEGAPRO",
        "sku": "MP-CH-8019M",
        "empaque": "36",
        "pie_cub": "0.9567",
        "peso": "18.150KG",
        "cbm": "0.027",
        "precio": 2.13,
        "inv": "12 PZA",
        "stock": 12
    },
    {
        "code": "11248",
        "name": "CANDADO ANTICISALLA 84MM MEGAPRO",
        "sku": "MP-CHCA840",
        "empaque": "24",
        "pie_cub": "0.6452",
        "peso": "18.700KG",
        "cbm": "0.018",
        "precio": 2.79,
        "inv": "480 PZA",
        "stock": 480
    },
    {
        "code": "11294",
        "name": "CANDADO ANTICISALLA 90 MM MEGAPRO",
        "sku": "MP-CH-9020C",
        "empaque": "36",
        "pie_cub": "0.9567",
        "peso": "22.800KG",
        "cbm": "0.027",
        "precio": 2.38,
        "inv": "72 PZA",
        "stock": 72
    },
    {
        "code": "11246",
        "name": "CANDADO ANTICISALLA 90MM MEGAPRO",
        "sku": "MP-CH-9020M",
        "empaque": "36",
        "pie_cub": "0.9567",
        "peso": "21.680KG",
        "cbm": "0.027",
        "precio": 2.39,
        "inv": "36 PZA",
        "stock": 36
    },
    {
        "code": "11251",
        "name": "CANDADO ANTICISALLA 90MM MEGAPRO",
        "sku": "MP-CHCA9020",
        "empaque": "36",
        "pie_cub": "0.9567",
        "peso": "21.740KG",
        "cbm": "0.027",
        "precio": 2.47,
        "inv": "324 PZA",
        "stock": 324
    },
    # Page 17
    {
        "code": "11297",
        "name": "CANDADO ANTICISALLA 94 MM MEGAPRO",
        "sku": "MP-CHCA944",
        "empaque": "24",
        "pie_cub": "0.6452",
        "peso": "20.980KG",
        "cbm": "0.018",
        "precio": 2.96,
        "inv": "432 PZA",
        "stock": 432
    },
    {
        "code": "13101",
        "name": "CANDADO ANTICIZALLA BRONCE 50MM MEGAPRO",
        "sku": "MP-C50MM3",
        "empaque": "36",
        "pie_cub": "0.0000",
        "peso": "8.600KG",
        "cbm": "0.012",
        "precio": 4.34,
        "inv": "720 PZA",
        "stock": 720
    },
    {
        "code": "13102",
        "name": "CANDADO ANTICIZALLA BRONCE 60MM MEGAPRO",
        "sku": "MP-C60MM3",
        "empaque": "36",
        "pie_cub": "0.0000",
        "peso": "11.400KG",
        "cbm": "0.014",
        "precio": 5.41,
        "inv": "720 PZA",
        "stock": 720
    },
    {
        "code": "13103",
        "name": "CANDADO ANTICIZALLA BRONCE 70MM MEGAPRO",
        "sku": "MP-C70MM3",
        "empaque": "36",
        "pie_cub": "0.0000",
        "peso": "15.500KG",
        "cbm": "0.019",
        "precio": 7.34,
        "inv": "720 PZA",
        "stock": 720
    },
    {
        "code": "13104",
        "name": "CANDADO ANTICIZALLA BRONCE 80MM MEGAPRO",
        "sku": "MP-C80MM3",
        "empaque": "36",
        "pie_cub": "0.0000",
        "peso": "15.500KG",
        "cbm": "0.021",
        "precio": 8.16,
        "inv": "720 PZA",
        "stock": 720
    },
    {
        "code": "13105",
        "name": "CANDADO ANTICIZALLA BRONCE 90MM MEGAPRO",
        "sku": "MP-C90MM3",
        "empaque": "36",
        "pie_cub": "0.0000",
        "peso": "20.700KG",
        "cbm": "0.021",
        "precio": 11.00,
        "inv": "720 PZA",
        "stock": 720
    },
    {
        "code": "13106",
        "name": "CANDADO BRONCE 40MM MEGAPRO",
        "sku": "MP-C403M",
        "empaque": "120",
        "pie_cub": "0.0000",
        "peso": "21.300KG",
        "cbm": "0.042",
        "precio": 2.53,
        "inv": "2400 PZA",
        "stock": 2400
    },
    {
        "code": "13107",
        "name": "CANDADO BRONCE 50MM MEGAPRO",
        "sku": "MP-C503M",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "18.700KG",
        "cbm": "0.025",
        "precio": 3.92,
        "inv": "1200 PZA",
        "stock": 1200
    },
    {
        "code": "13108",
        "name": "CANDADO BRONCE 60MM MEGAPRO",
        "sku": "MP-C603M",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "27.300KG",
        "cbm": "0.031",
        "precio": 5.54,
        "inv": "1200 PZA",
        "stock": 1200
    },
    # Page 18
    {
        "code": "11645",
        "name": "CARGADOR DE BATERIA 50 AMP MEGAPRO",
        "sku": "MP-CABC50A",
        "empaque": "4",
        "pie_cub": "2.2756",
        "peso": "17.000KG",
        "cbm": "0.064",
        "precio": 21.04,
        "inv": "108 PZA",
        "stock": 108
    },
    {
        "code": "10618",
        "name": "CARGADOR DE BATERIA MEGAPRO",
        "sku": "DFC-30P",
        "empaque": "1",
        "pie_cub": "0.6562",
        "peso": "9.920KG",
        "cbm": "0.019",
        "precio": 38.96,
        "inv": "21 PZA",
        "stock": 21
    },
    {
        "code": "10619",
        "name": "CARGADOR DE BATERIA MEGAPRO",
        "sku": "DFC-50P",
        "empaque": "1",
        "pie_cub": "2.3698",
        "peso": "15.600KG",
        "cbm": "0.067",
        "precio": 53.69,
        "inv": "25 PZA",
        "stock": 25
    },
    {
        "code": "12134",
        "name": "CARRETILLA 50X70 MEGAPRO",
        "sku": "MP-CPR123",
        "empaque": "2",
        "pie_cub": "2.1212",
        "peso": "12.000KG",
        "cbm": "0.060",
        "precio": 11.63,
        "inv": "80 PZA",
        "stock": 80
    },
    {
        "code": "12136",
        "name": "CARRETILLA 50X70 MEGAPRO",
        "sku": "MP-CPRC45",
        "empaque": "2",
        "pie_cub": "3.1982",
        "peso": "15.000KG",
        "cbm": "0.090",
        "precio": 13.96,
        "inv": "40 PZA",
        "stock": 40
    },
    {
        "code": "12137",
        "name": "CARRETILLA 60X90 MEGAPRO",
        "sku": "MP-CPRN67",
        "empaque": "2",
        "pie_cub": "3.6233",
        "peso": "19.000KG",
        "cbm": "0.103",
        "precio": 24.41,
        "inv": "40 PZA",
        "stock": 40
    },
    {
        "code": "11703",
        "name": "CAUTIN 60 WATT MEGAPRO",
        "sku": "MP-CH60W83",
        "empaque": "100",
        "pie_cub": "1.8326",
        "peso": "12.000KG",
        "cbm": "0.052",
        "precio": 1.08,
        "inv": "1100 PZA",
        "stock": 1100
    },
    {
        "code": "11704",
        "name": "CAUTIN 60 WATT MEGAPRO",
        "sku": "MP-CH60W84",
        "empaque": "100",
        "pie_cub": "1.8326",
        "peso": "12.000KG",
        "cbm": "0.052",
        "precio": 1.18,
        "inv": "1000 PZA",
        "stock": 1000
    },
    {
        "code": "11705",
        "name": "CAUTIN PISTOLA 30-70 WATT MEGAPRO",
        "sku": "MP-CTP3070W",
        "empaque": "50",
        "pie_cub": "1.3856",
        "peso": "8.000KG",
        "cbm": "0.040",
        "precio": 1.68,
        "inv": "1100 PZA",
        "stock": 1100
    },
    # Page 19
    {
        "code": "13117",
        "name": "CERRADURA COMPLETA MEGAPRO",
        "sku": "MP-CDS24",
        "empaque": "16",
        "pie_cub": "0.0000",
        "peso": "21.949KG",
        "cbm": "0.053",
        "precio": 7.18,
        "inv": "528 PZA",
        "stock": 528
    },
    {
        "code": "13118",
        "name": "CERRADURA COMPLETA MEGAPRO",
        "sku": "MP-CDS50",
        "empaque": "16",
        "pie_cub": "0.0000",
        "peso": "21.949KG",
        "cbm": "0.053",
        "precio": 7.18,
        "inv": "528 PZA",
        "stock": 528
    },
    {
        "code": "13116",
        "name": "CERRADURA COMPLETA MEGAPRO",
        "sku": "MP-CDS75",
        "empaque": "16",
        "pie_cub": "0.0000",
        "peso": "21.949KG",
        "cbm": "0.053",
        "precio": 7.18,
        "inv": "528 PZA",
        "stock": 528
    },
    {
        "code": "10913",
        "name": "CERRADURA CUADRADA DERECHA MEGAPRO",
        "sku": "MP-FCA100",
        "empaque": "30",
        "pie_cub": "1.3794",
        "peso": "23.500KG",
        "cbm": "0.039",
        "precio": 3.87,
        "inv": "1382 PZA",
        "stock": 1382
    },
    {
        "code": "10914",
        "name": "CERRADURA CUADRADA IZQUIERDA MEGAPRO",
        "sku": "MP-FCA100B",
        "empaque": "30",
        "pie_cub": "1.3794",
        "peso": "23.500KG",
        "cbm": "0.039",
        "precio": 3.87,
        "inv": "691 PZA",
        "stock": 691
    },
    {
        "code": "10265",
        "name": "CERRADURA CUADRADA MEGAPRO",
        "sku": "MG-CDSD314056",
        "empaque": "30",
        "pie_cub": "2.1895",
        "peso": "28.200KG",
        "cbm": "0.062",
        "precio": 4.20,
        "inv": "30 PZA",
        "stock": 30
    },
    {
        "code": "11644",
        "name": "CERRADURA CUADRADA MEGAPRO",
        "sku": "MP-FCA200",
        "empaque": "40",
        "pie_cub": "1.5668",
        "peso": "24.000KG",
        "cbm": "0.044",
        "precio": 2.76,
        "inv": "880 PZA",
        "stock": 880
    },
    {
        "code": "10284",
        "name": "CERRADURA DE MANILLA EN BLISTER MEGAPRO",
        "sku": "MP-CCLL011",
        "empaque": "24",
        "pie_cub": "2.6541",
        "peso": "15.350KG",
        "cbm": "0.075",
        "precio": 4.66,
        "inv": "28 PZA",
        "stock": 28
    },
    {
        "code": "10286",
        "name": "CERRADURA DE MANILLA EN BLISTER MEGAPRO",
        "sku": "MP-CCLL014",
        "empaque": "24",
        "pie_cub": "2.6541",
        "peso": "13.400KG",
        "cbm": "0.075",
        "precio": 4.72,
        "inv": "1 PZA",
        "stock": 1
    },
    # Page 20
    {
        "code": "10275",
        "name": "CERRADURA DE POMO EN BLISTER MEGAPRO",
        "sku": "MP-CCLL002",
        "empaque": "24",
        "pie_cub": "1.9085",
        "peso": "12.750KG",
        "cbm": "0.054",
        "precio": 2.44,
        "inv": "120 PZA",
        "stock": 120
    },
    {
        "code": "10278",
        "name": "CERRADURA DE POMO EN BLISTER MEGAPRO",
        "sku": "MP-CCLL005",
        "empaque": "24",
        "pie_cub": "2.0975",
        "peso": "14.450KG",
        "cbm": "0.059",
        "precio": 3.07,
        "inv": "41 PZA",
        "stock": 41
    },
    {
        "code": "10279",
        "name": "CERRADURA DE POMO EN BLISTER MEGAPRO",
        "sku": "MP-CCLL006",
        "empaque": "24",
        "pie_cub": "2.0697",
        "peso": "13.400KG",
        "cbm": "0.059",
        "precio": 3.07,
        "inv": "47 PZA",
        "stock": 47
    },
    {
        "code": "10290",
        "name": "CERRADURA DE POMO EN BLISTER MEGAPRO",
        "sku": "MP-CCLL018",
        "empaque": "24",
        "pie_cub": "1.6480",
        "peso": "11.250KG",
        "cbm": "0.047",
        "precio": 2.77,
        "inv": "48 PZA",
        "stock": 48
    },
    {
        "code": "13110",
        "name": "CERRADURA DE POMO MEGAPRO",
        "sku": "MP-CPCMLB",
        "empaque": "40",
        "pie_cub": "0.0000",
        "peso": "19.300KG",
        "cbm": "0.050",
        "precio": 2.15,
        "inv": "2000 PZA",
        "stock": 2000
    },
    {
        "code": "13111",
        "name": "CERRADURA DE POMO MEGAPRO",
        "sku": "MP-CPLB02",
        "empaque": "40",
        "pie_cub": "0.0000",
        "peso": "19.400KG",
        "cbm": "0.050",
        "precio": 2.15,
        "inv": "2000 PZA",
        "stock": 2000
    },
    {
        "code": "13109",
        "name": "CERRADURA DE POMO MEGAPRO",
        "sku": "MP-PCC3L1",
        "empaque": "40",
        "pie_cub": "0.0000",
        "peso": "16.300KG",
        "cbm": "0.050",
        "precio": 2.05,
        "inv": "2000 PZA",
        "stock": 2000
    },
    {
        "code": "12949",
        "name": "CERRADURA DE PORTON DE SEGURIDAD MEGAPRO",
        "sku": "MP-CSTPS1",
        "empaque": "20",
        "pie_cub": "0.0000",
        "peso": "18.791KG",
        "cbm": "0.024",
        "precio": 7.63,
        "inv": "3540 PZA",
        "stock": 3540
    },
    {
        "code": "10296",
        "name": "CERRADURA DE SEGURIDAD LLAVE/LLAVE MEGAPRO",
        "sku": "MP-CCLL024",
        "empaque": "24",
        "pie_cub": "1.4136",
        "peso": "7.797KG",
        "cbm": "0.040",
        "precio": 3.48,
        "inv": "72 PZA",
        "stock": 72
    },
    # Page 21
    {
        "code": "10297",
        "name": "CERRADURA DE SEGURIDAD LLAVE/LLAVE MEGAPRO",
        "sku": "MP-CCLL025",
        "empaque": "24",
        "pie_cub": "1.4136",
        "peso": "7.931KG",
        "cbm": "0.040",
        "precio": 3.48,
        "inv": "72 PZA",
        "stock": 72
    },
    {
        "code": "10292",
        "name": "CERRADURA DE SEGURIDAD POMO/LLAVE MEGAPRO",
        "sku": "MP-CCLL020",
        "empaque": "24",
        "pie_cub": "1.3403",
        "peso": "8.750KG",
        "cbm": "0.038",
        "precio": 2.93,
        "inv": "48 PZA",
        "stock": 48
    },
    {
        "code": "10293",
        "name": "CERRADURA DE SEGURIDAD POMO/LLAVE MEGAPRO",
        "sku": "MP-CCLL021",
        "empaque": "24",
        "pie_cub": "1.4136",
        "peso": "29.669KG",
        "cbm": "0.040",
        "precio": 2.89,
        "inv": "48 PZA",
        "stock": 48
    },
    {
        "code": "10294",
        "name": "CERRADURA DE SEGURIDAD POMO/LLAVE MEGAPRO",
        "sku": "MP-CCLL022",
        "empaque": "24",
        "pie_cub": "1.4136",
        "peso": "8.276KG",
        "cbm": "0.040",
        "precio": 2.89,
        "inv": "48 PZA",
        "stock": 48
    },
    {
        "code": "11620",
        "name": "CHIPEADORA MANUAL",
        "sku": "MP-CHA256",
        "empaque": "12",
        "pie_cub": "4.0602",
        "peso": "15.004KG",
        "cbm": "0.120",
        "precio": 2.73,
        "inv": "6 PZA",
        "stock": 6
    },
    {
        "code": "11701",
        "name": "CILINDRO 60MM MEGAPRO",
        "sku": "MP-CCCP60M",
        "empaque": "120",
        "pie_cub": "0.3554",
        "peso": "16.810KG",
        "cbm": "0.010",
        "precio": 1.26,
        "inv": "12 PZA",
        "stock": 12
    },
    {
        "code": "10257",
        "name": "CILINDRO DE SEGURIDAD MEGAPRO",
        "sku": "MP-SCYLIN-3K",
        "empaque": "60",
        "pie_cub": "1.0012",
        "peso": "12.300KG",
        "cbm": "0.028",
        "precio": 2.20,
        "inv": "240 PZA",
        "stock": 240
    },
    {
        "code": "12916",
        "name": "CINTA ANTIDESLIZANTE 2 COLORES 5 METROS MEGAPRO",
        "sku": "MP-CA455D",
        "empaque": "72",
        "pie_cub": "0.0000",
        "peso": "11.000KG",
        "cbm": "0.044",
        "precio": 1.09,
        "inv": "1224 PZA",
        "stock": 1224
    },
    {
        "code": "12915",
        "name": "CINTA ANTIDESLIZANTE NEGRA 5 METROS MEGAPRO",
        "sku": "MP-CND455",
        "empaque": "72",
        "pie_cub": "0.0000",
        "peso": "11.000KG",
        "cbm": "0.044",
        "precio": 0.98,
        "inv": "1152 PZA",
        "stock": 1152
    },
    # Page 22
    {
        "code": "12917",
        "name": "CINTA DE ALUMINIO 20 METROS MEGAPRO",
        "sku": "MP-CA4820",
        "empaque": "144",
        "pie_cub": "0.0000",
        "peso": "22.700KG",
        "cbm": "0.090",
        "precio": 0.93,
        "inv": "2160 PZA",
        "stock": 2160
    },
    {
        "code": "10946",
        "name": "CINTA DE BUTILO 2M X 10 CM MEGAPRO",
        "sku": "MP-CMB2M",
        "empaque": "27",
        "pie_cub": "1.3064",
        "peso": "14.500KG",
        "cbm": "0.037",
        "precio": 0.98,
        "inv": "297 PZA",
        "stock": 297
    },
    {
        "code": "10947",
        "name": "CINTA DE BUTILO 4M X 10 CM MEGAPRO",
        "sku": "MP-CMB4M",
        "empaque": "18",
        "pie_cub": "1.3064",
        "peso": "18.700KG",
        "cbm": "0.037",
        "precio": 1.69,
        "inv": "36 PZA",
        "stock": 36
    },
    {
        "code": "10949",
        "name": "CINTA DE BUTILO 5M 20CM MEGAPRO",
        "sku": "MP-CMB25",
        "empaque": "9",
        "pie_cub": "1.3060",
        "peso": "22.100KG",
        "cbm": "0.037",
        "precio": 4.15,
        "inv": "27 PZA",
        "stock": 27
    },
    {
        "code": "10948",
        "name": "CINTA DE BUTILO 8M X 10CM MEGAPRO",
        "sku": "MP-CMB8M",
        "empaque": "12",
        "pie_cub": "1.3064",
        "peso": "23.700KG",
        "cbm": "0.037",
        "precio": 3.09,
        "inv": "36 PZA",
        "stock": 36
    },
    {
        "code": "12905",
        "name": "CINTA DE GEL NANOSILICONA 2mmX2.4cmX2m MEGAPRO",
        "sku": "MP-CDG241",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "20.000KG",
        "cbm": "0.085",
        "precio": 0.47,
        "inv": "3400 PZA",
        "stock": 3400
    },
    {
        "code": "12904",
        "name": "CINTA DE GEL NANOSILICONA 2mmX2.4cmX2mMEGAPRO",
        "sku": "MP-CDG224",
        "empaque": "200",
        "pie_cub": "0.0000",
        "peso": "20.000KG",
        "cbm": "0.070",
        "precio": 0.50,
        "inv": "3400 PZA",
        "stock": 3400
    },
    {
        "code": "12962",
        "name": "CINTA DE REMOLQUE MEGAPRO",
        "sku": "MP-C3MPR1",
        "empaque": "60",
        "pie_cub": "0.0000",
        "peso": "19.700KG",
        "cbm": "0.051",
        "precio": 2.08,
        "inv": "1200 PZA",
        "stock": 1200
    },
    {
        "code": "12902",
        "name": "CINTA DE SEGURIDAD 15 METROS MEGAPRO",
        "sku": "MP-C15048",
        "empaque": "72",
        "pie_cub": "0.0000",
        "peso": "13.000KG",
        "cbm": "0.040",
        "precio": 0.71,
        "inv": "1224 PZA",
        "stock": 1224
    },
    # Page 23
    {
        "code": "12906",
        "name": "CINTA DOBLE FAX 2mmX1.8cmX2m MEGAPRO",
        "sku": "MP-C21820",
        "empaque": "288",
        "pie_cub": "0.0000",
        "peso": "2.500KG",
        "cbm": "0.054",
        "precio": 0.18,
        "inv": "4320 PZA",
        "stock": 4320
    },
    {
        "code": "12907",
        "name": "CINTA DOBLE FAX 2mmX2.4cmX2m MEGAPRO",
        "sku": "MP-C2420",
        "empaque": "288",
        "pie_cub": "0.0000",
        "peso": "2.700KG",
        "cbm": "0.065",
        "precio": 0.21,
        "inv": "4320 PZA",
        "stock": 4320
    },
    {
        "code": "12903",
        "name": "CINTA PARA DUCTO 10 METROS MEGAPRO",
        "sku": "MP-CB4810",
        "empaque": "72",
        "pie_cub": "0.0000",
        "peso": "7.500KG",
        "cbm": "0.040",
        "precio": 0.59,
        "inv": "1224 PZA",
        "stock": 1224
    },
    {
        "code": "10930",
        "name": "CINTA PARA ESMASCARAR MEGAPRO",
        "sku": "MP-CE1120M",
        "empaque": "144",
        "pie_cub": "1.1230",
        "peso": "8.280KG",
        "cbm": "0.032",
        "precio": 0.26,
        "inv": "86 PZA",
        "stock": 86
    },
    {
        "code": "10929",
        "name": "CINTA PARA ESMASCARAR MEGAPRO",
        "sku": "MP-CE12010",
        "empaque": "12",
        "pie_cub": "1.2290",
        "peso": "8.290KG",
        "cbm": "0.035",
        "precio": 2.76,
        "inv": "4 PZA",
        "stock": 4
    },
    {
        "code": "10928",
        "name": "CINTA PARA ESMASCARAR MEGAPRO",
        "sku": "MP-CE2206",
        "empaque": "12",
        "pie_cub": "1.1230",
        "peso": "8.280KG",
        "cbm": "0.032",
        "precio": 2.42,
        "inv": "7 PZA",
        "stock": 7
    },
    {
        "code": "10927",
        "name": "CINTA PARA SEÑALIZACION MEGAPRO",
        "sku": "MP-CS8100",
        "empaque": "48",
        "pie_cub": "1.5219",
        "peso": "12.990KG",
        "cbm": "0.043",
        "precio": 0.82,
        "inv": "3600 PZA",
        "stock": 3600
    },
    {
        "code": "10373",
        "name": "CLAVO DE ACERO 1 PULG 500 GR MEGAPRO",
        "sku": "MP-NAIL500G-1",
        "empaque": "40",
        "pie_cub": "0.4286",
        "peso": "20.300KG",
        "cbm": "0.012",
        "precio": 0.99,
        "inv": "442 BAG",
        "stock": 442
    },
    {
        "code": "10374",
        "name": "CLAVO DE ACERO 3/4 PULG 500 GR MEGAPRO",
        "sku": "MP-NAIL500G-34",
        "empaque": "40",
        "pie_cub": "0.4009",
        "peso": "20.300KG",
        "cbm": "0.011",
        "precio": 0.99,
        "inv": "400 BAG",
        "stock": 400
    },
    # Page 24
    {
        "code": "11833",
        "name": "CLAVO GALVANIZADO 500GR 2 PULG. *11 MEGAPRO",
        "sku": "MP-CG211",
        "empaque": "40",
        "pie_cub": "0.7063",
        "peso": "20.000KG",
        "cbm": "0.020",
        "precio": 0.62,
        "inv": "40 PZA",
        "stock": 40
    },
    {
        "code": "11834",
        "name": "CLAVO GALVANIZADO 500GR 2.5 PULG. *11 MEGAPRO",
        "sku": "MP-CG212",
        "empaque": "40",
        "pie_cub": "0.7063",
        "peso": "20.000KG",
        "cbm": "0.020",
        "precio": 0.62,
        "inv": "80 PZA",
        "stock": 80
    },
    {
        "code": "11835",
        "name": "CLAVO GALVANIZADO 500GR 3 PULG. *10 MEGAPRO",
        "sku": "MP-CG310",
        "empaque": "40",
        "pie_cub": "0.7063",
        "peso": "20.000KG",
        "cbm": "0.020",
        "precio": 0.62,
        "inv": "200 PZA",
        "stock": 200
    },
    {
        "code": "11836",
        "name": "CLAVO GALVANIZADO 500GRV 4 PULG. *8 MEGAPRO",
        "sku": "MP-CG480",
        "empaque": "40",
        "pie_cub": "0.7063",
        "peso": "20.000KG",
        "cbm": "0.020",
        "precio": 0.62,
        "inv": "40 PZA",
        "stock": 40
    },
    {
        "code": "10259",
        "name": "CLAVO SIN CABEZA GALVANIZADO 1 PULG 0.5 KG MEGAPRO",
        "sku": "MP-KCD20031",
        "empaque": "40",
        "pie_cub": "0.7628",
        "peso": "20.500KG",
        "cbm": "0.022",
        "precio": 0.80,
        "inv": "3320 BAG",
        "stock": 3320
    },
    {
        "code": "10260",
        "name": "CLAVO SIN CABEZA GALVANIZADO 1.1/2 PULG 0.5 KG MEGAPRO",
        "sku": "MP-KCD2003112",
        "empaque": "40",
        "pie_cub": "0.7628",
        "peso": "20.500KG",
        "cbm": "0.022",
        "precio": 0.80,
        "inv": "3320 BAG",
        "stock": 3320
    },
    {
        "code": "10261",
        "name": "CLAVO SIN CABEZA GALVANIZADO 2 PULG 0.5 KG MEGAPRO",
        "sku": "MP-KCD20032",
        "empaque": "40",
        "pie_cub": "0.7628",
        "peso": "20.500KG",
        "cbm": "0.022",
        "precio": 0.71,
        "inv": "3360 BAG",
        "stock": 3360
    },
    {
        "code": "10262",
        "name": "CLAVO SIN CABEZA GALVANIZADO 2.1/2 PULG 0.5 KG MEGAPRO",
        "sku": "MP-KCD2003212",
        "empaque": "40",
        "pie_cub": "0.7628",
        "peso": "20.500KG",
        "cbm": "0.022",
        "precio": 0.71,
        "inv": "1760 BAG",
        "stock": 1760
    },
    {
        "code": "10263",
        "name": "CLAVO SIN CABEZA GALVANIZADO 3 PULG 0.5 KG MEGAPRO",
        "sku": "MP-KCD20033",
        "empaque": "40",
        "pie_cub": "0.7628",
        "peso": "20.500KG",
        "cbm": "0.022",
        "precio": 0.71,
        "inv": "1760 BAG",
        "stock": 1760
    },
    # Page 25
    {
        "code": "10258",
        "name": "CLAVO SIN CABEZA GALVANIZADO 3/4 PULG 0.5 KG MEGAPRO",
        "sku": "MP-KCD20034",
        "empaque": "40",
        "pie_cub": "0.7628",
        "peso": "20.500KG",
        "cbm": "0.022",
        "precio": 0.88,
        "inv": "3360 BAG",
        "stock": 3360
    },
    {
        "code": "10264",
        "name": "CLAVO SIN CABEZA GALVANIZADO 4 PULG 0.5 KG MEGAPRO",
        "sku": "MP-KCD200344",
        "empaque": "40",
        "pie_cub": "0.7628",
        "peso": "20.500KG",
        "cbm": "0.022",
        "precio": 0.71,
        "inv": "2520 BAG",
        "stock": 2520
    },
    {
        "code": "12884",
        "name": "CONECTOR PARA BARRA DE TIERRA",
        "sku": "MP-C58A4B",
        "empaque": "500",
        "pie_cub": "0.0000",
        "peso": "26.000KG",
        "cbm": "0.020",
        "precio": 0.83,
        "inv": "100 PZA",
        "stock": 100
    },
    {
        "code": "10981",
        "name": "CONO SEÑALIZACION MEGAPRO",
        "sku": "MP-CTD70",
        "empaque": "10",
        "pie_cub": "4.2395",
        "peso": "18.446KG",
        "cbm": "0.120",
        "precio": 6.81,
        "inv": "20 PZA",
        "stock": 20
    },
    {
        "code": "10689",
        "name": "CORDEL PP-30 1 KG. MEGAPRO",
        "sku": "MP-NYCG1",
        "empaque": "20",
        "pie_cub": "2.0059",
        "peso": "21.017KG",
        "cbm": "0.057",
        "precio": 3.42,
        "inv": "3960 ROLL",
        "stock": 3960
    },
    {
        "code": "10690",
        "name": "CORDEL PP-30 500 GR. MEGAPRO",
        "sku": "MP-NYCG500",
        "empaque": "40",
        "pie_cub": "2.1217",
        "peso": "21.040KG",
        "cbm": "0.060",
        "precio": 1.73,
        "inv": "2080 ROLL",
        "stock": 2080
    }
]

print(f"Total extracted items: {len(items_data)}")

# Let's generate TS products
def get_image_for_item(name):
    n = name.lower()
    if 'pistola de pintar' in n:
        return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
    elif 'abrazadera' in n:
        return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    elif 'alambre' in n:
        return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    elif 'alicate' in n:
        return 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80'
    elif 'aspeiradora' in n or 'aspiradora' in n:
        return 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80'
    elif 'balanza' in n:
        return 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80'
    elif 'balastro' in n or 'boquilla' in n or 'benjami' in n:
        return 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80'
    elif 'balde' in n:
        return 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80'
    elif 'barra de tierra' in n or 'conector' in n:
        return 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
    elif 'base' in n and 'esmeril' in n:
        return 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80'
    elif 'base' in n and 'tubo led' in n:
        return 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80'
    elif 'bisagra' in n:
        return 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80'
    elif 'bombillo' in n:
        return 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?auto=format&fit=crop&w=800&q=80'
    elif 'brazo para puerta' in n:
        return 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80'
    elif 'brecker' in n:
        return 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80'
    elif 'broca' in n:
        return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    elif 'brocha' in n:
        return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
    elif 'cadena' in n:
        return 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80'
    elif 'cajetin' in n:
        return 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80'
    elif 'calentador' in n:
        return 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
    elif 'camilla' in n:
        return 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
    elif 'candado' in n:
        return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80'
    elif 'cargador de bateria' in n:
        return 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80'
    elif 'carretilla' in n:
        return 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80'
    elif 'cautin' in n:
        return 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
    elif 'cerradura' in n or 'cilindro' in n:
        return 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80'
    elif 'chipeadora' in n:
        return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    elif 'cinta' in n:
        return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
    elif 'clavo' in n:
        return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    elif 'cono' in n:
        return 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80'
    elif 'cordel' in n:
        return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'

ts_output = """import { Product } from '../types';

export const megaproHardwareProducts: Product[] = [
"""

for item in items_data:
    desc = f"{item['name']}. Modelo: {item['sku']}, Código: {item['code']}. Empaque: {item['empaque']}, Peso: {item['peso']}, CBM: {item['cbm']}. Stock disponible: {item['inv']}."
    img = get_image_for_item(item['name'])
    ts_output += f"""  {{
    id: "megapro_{item['code']}",
    name: {json.dumps(item['name'])},
    price: {item['precio']},
    category: "2",
    section: "nuevo",
    brand: "MEGAPRO",
    sku: {json.dumps(item['sku'])},
    specs: {{
      "CÓDIGO": {json.dumps(item['code'])},
      "MODELO": {json.dumps(item['sku'])},
      "EMPAQUE": {json.dumps(item['empaque'])},
      "PESO": {json.dumps(item['peso'])},
      "PIE/CUB": {json.dumps(item['pie_cub'])},
      "CBM": {json.dumps(item['cbm'])},
      "INVENTARIO": {json.dumps(item['inv'])}
    }},
    image: "{img}",
    favorite: false,
    stock: {item['stock']},
    description: {json.dumps(desc)}
  }},
"""

ts_output += "];\n"

with open("src/data/megaproCatalog.ts", "w", encoding="utf-8") as f:
    f.write(ts_output)

print("Generated src/data/megaproCatalog.ts successfully with", len(items_data), "products")
