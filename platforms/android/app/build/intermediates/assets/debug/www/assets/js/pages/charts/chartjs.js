$(function () {
    // new Chart(document.getElementById("line_chart").getContext("2d"), getChartJs('line'));
    new Chart(document.getElementById("bar_chart").getContext("2d"), getChartJs('bar'));
    new Chart(document.getElementById("radar_chart").getContext("2d"), getChartJs('radar'));
    new Chart(document.getElementById("pie_chart").getContext("2d"), getChartJs('pie'));
});

function getChartJs(type) {
    var config = null;

    if (type === 'line') {
        config = {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: 'rgba(0,188,212,0.75)',
                    backgroundColor: 'rgba(0,188,212, 0.3)',
                    pointBorderColor: 'rgba(0,188,212, 0)',
                    pointBackgroundColor: 'rgba(0,188,212, 0.9)',
                    pointBorderWidth: 1
				}, {
						label: "My Second dataset",
						data: [28, 48, 40, 19, 86, 27, 90],
						borderColor: 'rgba(231,224,231, 0.75)',
						backgroundColor: 'rgba(231,224,231, 0.3)',
						pointBorderColor: 'rgba(231,224,231, 0)',
						pointBackgroundColor: 'rgba(231,224,231, 0.9)',
						pointBorderWidth: 1
					}]
            },
            options: {
                responsive: true,
                legend: false,
				 scales: {
					yAxes: [{
						 gridLines: {
							// display: false
							color: 'rgba(255, 255, 255, 0.15)'
						},
						ticks: {
							// beginAtZero:true,
							fontColor: 'white'
						},
					}],
				  xAxes: [{
					   gridLines: {
						   display: false
						  // color: 'rgba(255, 255, 255, 0.15)'
						},
						ticks: {
							fontColor: 'white'
						},
					}]
				} 
            }
        }
    }
    else if (type === 'bar') {
        config = {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(0, 188, 212, 0.8)'
                }, {
                        label: "My Second dataset",
                        data: [28, 48, 40, 19, 86, 27, 90],
                        backgroundColor: 'rgba(233, 30, 99, 0.8)'
                    }]
            },
            options: {
                responsive: true,
                legend: false
            }
        }
    }
    else if (type === 'radar') {
        config = {
            type: 'radar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    data: [65, 25, 90, 81, 56, 55, 40],
                    borderColor: 'rgba(0, 188, 212, 0.8)',
                    backgroundColor: 'rgba(0, 188, 212, 0.5)',
                    pointBorderColor: 'rgba(0, 188, 212, 0)',
                    pointBackgroundColor: 'rgba(0, 188, 212, 0.8)',
                    pointBorderWidth: 1
                }, {
                        label: "My Second dataset",
                        data: [72, 48, 40, 19, 96, 27, 100],
                        borderColor: 'rgba(233, 30, 99, 0.8)',
                        backgroundColor: 'rgba(233, 30, 99, 0.5)',
                        pointBorderColor: 'rgba(233, 30, 99, 0)',
                        pointBackgroundColor: 'rgba(233, 30, 99, 0.8)',
                        pointBorderWidth: 1
                    }]
            },
            options: {
                responsive: true,
                legend: false
            }
        }
    }
    else if (type === 'pie') {
        config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [225, 50, 100, 40],
                    backgroundColor: [
                        "rgb(233, 30, 99)",
                        "rgb(255, 193, 7)",
                        "rgb(0, 188, 212)",
                        "rgb(139, 195, 74)"
                    ],
                }],
                labels: [
                    "Pink",
                    "Amber",
                    "Cyan",
                    "Light Green"
                ]
            },
            options: {
                responsive: true,
                legend: false
            }
        }
    }
    return config;
}

function displayMyChart(type,da){
	$('#chartContainer').show();
	$('#pageIconContainer').find('h3').remove();
	$('#line_chart').css({'z-index':'2','margin-top':'-180px'});
	var lb = [];
	var dt = [];
	var monthNames = ["", "January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		];
	$.each($(da), function(i) {
		lb.push(monthNames[da[i].bulan]);
		dt.push(da[i].nilai)
	});
	config = {
            type: 'line',
            data: {
                labels: lb,
                datasets: [{
						label: "Data progress",
						data: dt,
						borderColor: 'rgba(231,224,231, 0.75)',
						backgroundColor: 'rgba(231,224,231, 0.3)',
						pointBorderColor: 'rgba(231,224,231, 0)',
						pointBackgroundColor: 'rgba(231,224,231, 0.9)',
						pointBorderWidth: 1
					}]
            },
            options: {
                responsive: true,
                legend: false,
				 scales: {
					yAxes: [{
						 gridLines: {
							// display: false
							color: 'rgba(255, 255, 255, 0.15)'
						},
						ticks: {
							// beginAtZero:true,
							fontColor: 'white'
						},
					}],
				  xAxes: [{
					   gridLines: {
						   display: false
						  // color: 'rgba(255, 255, 255, 0.15)'
						},
						ticks: {
							fontColor: 'white'
						},
					}]
				} 
            }
        }
	 return config;
}