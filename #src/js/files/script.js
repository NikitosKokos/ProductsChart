document.addEventListener('DOMContentLoaded', () => {
   const regulator = document.querySelector('.chart__regulator');
   let labels = [];
   let dataOfChart = [];
   let products = [];

   const data = {
      labels: [],
      datasets: [{
         backgroundColor: '#fff',
         borderColor: 'rgb(255, 99, 132)',
         borderWidth: 4,
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
                  display: false
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
         },
         layout: {
            padding: 20
        }
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
                  display: false
               },
               grid: {
                  display: false
               }
            },
            y: {
               ticks: {
                  display: false
               },
               grid: {
                  display: false
               }
            }
         },
         plugins: {
            legend: {
               display: false,
            }
         },
         layout: {
            // padding: 10
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
      const sliderBtns = document.querySelectorAll('.noUi-handle');
      sliderBtns.forEach(btn => {
         btn.style.height = `${regulator.offsetHeight}px`;
      });
   }

   function addData(chart, label, data) {
      chart.data.labels = label;
      chart.data.datasets[0].data = data;
      chart.update();
  }

  getLabels();

}); // end