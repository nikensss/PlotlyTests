$(document).ready(function () {
  console.log(data);

  // const relevantTradingSymbols = [
  //   ...new Set(data.map(e => e.TradingSymbol))
  // ].sort((a, z) => (a <= z ? -1 : 1));

  const relevantTradingSymbols = [
    'AAPL',
    'ABBV',
    'ACN',
    'ADBE',
    'AMD',
    'AMGN',
    'AMZN',
    'AXP',
    'BA',
    'BAC',
    'BIIB',
    'BRK.B',
    'CAT',
    'COST',
    'CRM',
    'CVX',
    'DE',
    'DIS',
    'FB',
    'GD',
    'GE',
    'GILD',
    'GM',
    'GOOG',
    'HD',
    'IBM',
    'INTC',
    'INTU',
    'JNJ',
    'JPM',
    'KO',
    'LMT',
    'LOW',
    'LYFT',
    'MA',
    'MO',
    'MRK',
    'MSFT',
    'NFLX',
    'NKE',
    'NVDA',
    'ORCL',
    'PEP',
    'PFE',
    'PG',
    'PM',
    'PYPL',
    'RTN',
    'SNAP',
    'TSLA',
    'TWTR',
    'TXN',
    'UTX',
    'V',
    'WFC',
    'WMT',
    'XOM'
  ];

  const plotData = data
    .filter(
      d =>
        relevantTradingSymbols.includes(d.TradingSymbol.toUpperCase()) &&
        parseInt(d.DocumentFiscalYearFocus) <= 2100 &&
        parseInt(d.DocumentFiscalYearFocus) >= 1900
    )
    .sort((a, z) =>
      a.TradingSymbol.toLowerCase() <= z.TradingSymbol.toLowerCase() ? -1 : 1
    );

  console.log(plotData);

  const allYears = plotData.map(e => parseInt(e.DocumentFiscalYearFocus));
  const minYear = Math.min.apply(Math, allYears);
  const maxYear = Math.max.apply(Math, allYears);
  const yearsToPlot = [];

  for (let year = maxYear; year >= minYear; year--) {
    yearsToPlot.push(year);
  }
  console.log(`Years to plot: ${yearsToPlot}`);
  const grid = $('.grid');

  //build the necessary columns (one per company)
  grid.css(
    'grid-template-columns',
    `repeat(${relevantTradingSymbols.length + 1}, 1fr)`
  );
  //build the necessary rows (one per year with data)
  grid.css('grid-template-rows', `repeat(${yearsToPlot.length + 1}, 1fr)`);

  grid.append(
    `<div class="corner" style="grid-column: 0 / span 1; grid-row: ${
      yearsToPlot.length + 1
    } / span 1;"></div>`
  );

  //show the years
  yearsToPlot.forEach((y, i) => {
    grid.append(
      `<div class="year" style="grid-column: 0 / span 1; grid-row: ${
        i + 1
      }/ span 1; display: flex; justify-content: center; align-items: center;">
          <p>${y}</p>
      </div>`
    );
  });

  //show the tickers
  relevantTradingSymbols.forEach((y, i) => {
    grid.append(
      `<div class="ticker" style="grid-column: ${i + 2} / span 1; grid-row: ${
        yearsToPlot.length + 1
      }/ span 1; display: flex; justify-content: center; align-items: center;">
          <p>${y}</p>
      </div>`
    );
  });

  //build the plot
  const tickerGroupedData = plotData.reduce((t, c) => {
    let e = t.find(n => n.TradingSymbol === c.TradingSymbol);
    if (!e) {
      e = { TradingSymbol: c.TradingSymbol, years: new Set() };
      t.push(e);
    }
    e.years.add(parseInt(c.DocumentFiscalYearFocus));
    return t;
  }, []);

  tickerGroupedData.forEach(e => {
    const gridColumn = relevantTradingSymbols.indexOf(e.TradingSymbol) + 2;
    if (gridColumn < 2) {
      return;
    }
    e.years.forEach(y => {
      const gridRow = yearsToPlot.indexOf(y) + 1;
      grid.append(
        `<div class="available" style="grid-column: ${gridColumn} / span 1; grid-row: ${gridRow} / span 1;"></div>`
      );
    });
  });
});
