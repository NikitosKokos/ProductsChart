document.addEventListener('DOMContentLoaded', () => {
   const regulator = document.querySelector('.chart__regulator');
   const mainChart = document.querySelector('.chart__body');
   const loader = document.querySelector('.loader-wrapper');
   let sliderBtns;
   let labels = [];
   let dataOfChart = [];
   let products = [];

   Chart.defaults.borderColor = '#bbb';
   
   const data = {
      labels: [],
      datasets: [{
         backgroundColor: '#fff',
         borderColor: 'rgb(255, 99, 132)',
         borderWidth: 4,
         color: '#333',
         fill: true,
         data: [],
       }]
     };
   
     const config = {
       type: 'line',
       data: data,
       options: {
         animation: {
            x: {
              duration: 0,
            },
            y: {
              duration: 0,
            }
          },
         scales: {
            x: {
               grid: {
                  display: false,
               },
               ticks: {
                  color: '#ddd',
                  // autoSkipPadding: 5,
                  maxRotation: 0,
              }
            },
            y: {
               ticks: {
                  color: '#ddd',
              }
            }
         },
         plugins: {
            legend: {
               display: false
            },
            datalabels: {
               display: false,
           },
           tooltip: {
               titleColor: 'rgb(255, 99, 132)',
               displayColors: false,
               titleMarginBottom: 4,
               backgroundColor: '#111',
               caretSize: 7,
               padding: 10,
               bodyFont: {
                  size: 14 - (1920 / window.outerWidth - 1),
               },
               callbacks: {
                  label: (context) => {
                     let label = context.label || '';
                     return `Price: ${label}`
                  },
                  title: (context) => {
                     let title = context[0].formattedValue || '';
                     return `Rating: ${title}`
                  }
               },
           }
         },
       }
     };

     const data2 = {
      labels: [],
      datasets: [{
         backgroundColor: 'rgba(54, 162, 235, .2)',
         borderColor: 'rgb(54, 162, 235)',
         borderWidth: 4,
         fill: true,
         data: [],
       }]
     };
   
     const config2 = {
       type: 'line',
       data: data2,
       options: {
         aspectRatio: 15,
         animation: {
            x: {
              duration: 0,
            },
            y: {
              duration: 0,
            }
          },
         scales: {
            x: {
               ticks: {
                  display: false,
               },
               grid: {
                  borderColor: '#fff',
                  tickLength: 0,
                  display: false,
               }
            },
            y: {
               min: 3.9,
               ticks: {
                  display: false
               },
               grid: {
                  borderColor: '#fff',
                  tickLength: 0,
                  display: false,
               }
            }
         },
         plugins: {
            legend: {
               display: false,
            }
         },
        elements: {
         point:{
             radius: 0
         }
     }
       }
     };
   
     const myChart = new Chart(
      document.getElementById('myChart'),
      config
    );

    const mySmallChart = new Chart(
      document.getElementById('mySmallChart'),
      config2
    );

   async function getLabels(){
      const responce = await fetch('https://dummyjson.com/products?limit=100').then(data => data.json());
      products = responce.products.sort((a, b) => a.price - b.price);
      
      // show chart
      mainChart.classList.add('_active');
      loader.classList.add('_hide');

      chartSetting();
      labels = products.map(product => product.price);
      dataOfChart = products.map(product => product.rating);
      addData(myChart, labels, dataOfChart);
      addData(mySmallChart, labels, dataOfChart);

      noUiSlider.create(regulator, {
            start: [products.length - 30, products.length],
            step: 1,
            margin: 2,
            connect: true,
            behaviour: 'drag',
            connect: [true, true, true],
            range: {
               'min': 1,
               'max': products.length
            }
      });
      
      regulator.noUiSlider.on('update', (values) => {
         const fromValue = Number(values[0].split('.')[0]) - 1;
         const toValue = Number(values[1].split('.')[0]) - 1;
         labels = products.slice(fromValue, toValue).map(product => product.price);
         dataOfChart = products.slice(fromValue, toValue).map(product => product.rating);
         addData(myChart, labels, dataOfChart);
      });

      sliderBtns = document.querySelectorAll('.noUi-handle');
      setButtonsHeight();
   }

   function addData(chart, label, data) {
      chart.data.labels = label;
      chart.data.datasets[0].data = data;
      chart.update();
  }

  function setButtonsHeight(){
      sliderBtns.forEach(btn => {
         btn.style.height = `${regulator.offsetHeight}px`;
      });
   }


   function chartSetting(){
      if(window.outerWidth < 1920){
         Chart.defaults.font.size = 14 - (1920 / window.outerWidth - 1);
      }
      
      if(window.outerWidth < 480){
         mySmallChart.options.aspectRatio = 7;
         myChart.data.datasets[0].borderWidth = 2;
         myChart.options.elements.point.radius = 2;
         myChart.options.elements.point.hoverRadius = 3;
         myChart.options.elements.point.hoverBorderWidth = 1;
         mySmallChart.resize();
      }else if(window.outerWidth < 768){
         mySmallChart.options.aspectRatio = 9;
         myChart.data.datasets[0].borderWidth = 3;
         myChart.options.elements.point.radius = 3;
         myChart.options.elements.point.hoverRadius = 4;
         myChart.options.elements.point.hoverBorderWidth = 2;
         mySmallChart.resize();
      }else{
         mySmallChart.options.aspectRatio = 15;
         myChart.data.datasets[0].borderWidth = 4;
         myChart.options.elements.point.radius = 4;
         myChart.options.elements.point.hoverRadius = 5;
         myChart.options.elements.point.hoverBorderWidth = 2;
         mySmallChart.resize();
      }
   }

  window.addEventListener('resize', () => {
   setButtonsHeight();
   chartSetting();
  });

  getLabels();

}); // end