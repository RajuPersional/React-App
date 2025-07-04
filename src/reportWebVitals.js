const reportWebVitals = onPerfEntry => {    //{*1}
  if (onPerfEntry && onPerfEntry instanceof Function) { // This will check whether the onPerfEntry and check whether it is a Funtion or not 
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);// Cumulative Layout Shift→ it calculates how badly stuff jumps on screen.
      getFID(onPerfEntry);//First Input Delay → measures delay between user input and app response.
      getFCP(onPerfEntry);//getFCP()	Measures when the first content appears (text/image)
      getLCP(onPerfEntry);//getLCP()	Measures when the main part of the page finishes loading
      getTTFB(onPerfEntry);//getTTFB()	Measures how fast the server sends the first response
    });
  }
};

export default reportWebVitals;


{/*
          function reportWebVitals(handler) {
          if (typeof handler === 'function') {
            import('web-vitals').then((metrics) => {
              metrics.getCLS(handler);
              metrics.getFID(handler);
              metrics.getFCP(handler);
              metrics.getLCP(handler);
              metrics.getTTFB(handler);
            });
          }
        }

        export default reportWebVitals;
  */}