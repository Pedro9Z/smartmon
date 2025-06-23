import json
import pandas as pd
import mplfinance as mpf
import matplotlib
matplotlib.use('Agg')

def create_btc_chart():
    # Crear el directorio de charts si no existe
    import os
    if not os.path.exists('charts'):
        os.makedirs('charts')

    with open("data/btc_data.json", "r") as f:
        data = json.load(f)

    df = pd.DataFrame(data["prices"])
    df["date"] = pd.to_datetime(df["date"])
    df.set_index("date", inplace=True)

    # Niveles de Esteban (extraídos de la transcripción)
    niveles_esteban = {
        102682: {"color": "red", "linestyle": "--"},
        101575: {"color": "red", "linestyle": "--"},
        104886: {"color": "green", "linestyle": "--"}
    }

    hlines = dict(hlines=list(niveles_esteban.keys()), 
                  colors=[d['color'] for d in niveles_esteban.values()],
                  linestyles=[d['linestyle'] for d in niveles_esteban.values()])

    mpf.plot(df, type='candle', style='yahoo', 
             title='Caso de Estudio: Análisis de Bitcoin (2 de Junio 2025)',
             ylabel='Precio (USD)',
             volume=True, 
             hlines=hlines,
             savefig='charts/caso_estudio_btc.png')
    print("Gráfico del caso de estudio guardado en charts/caso_estudio_btc.png")

if __name__ == "__main__":
    create_btc_chart()