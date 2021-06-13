const API_KEY =
  "54d8335222897a25c0a5c2decd140e24022c996c4d70c260973f0a6bcd59da38";

const tickersHandlers = new Map(); // {}

// TODO : refactor to use URLSearchParams
const loadtickersHandlers = () => {
  if (tickersHandlers.size === 0) return;
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms${[
      ...tickersHandlers.keys()
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  ).then((response) =>
    response.json().then((rawData) => {
      const updetedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updetedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    })
  );
};

export const subscribeToTicker = (ticker, cb) => {
  const subscriber = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscriber, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  //   const subscriber = tickersHandlers.get(ticker) || [];
  //   tickersHandlers.set(
  //     ticker,
  //     subscriber.filter((fn) => fn !== cb)
  //   );
  tickersHandlers.delete(ticker);
};

setInterval(loadtickersHandlers, 5000);

window.tickersHandlers = tickersHandlers;

/* { a: 1, b:2} => [['a', 1], ['b', 2]] => [['a', 1], ['b', 0.5]]*/
// * - получать обновления стоимости криптовалютных пар с АПИ
