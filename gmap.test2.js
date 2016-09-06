<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Draggable directions</title>
    <style>
      #map {
        height: 100%;
        float: left;
        width: 100%;
        height: 500px;
      }
      .button-container {
          float: left;
          clear: both;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <div class="button-container">
        <button id="redrawButton">Redraw</button>
        <button id="clearMarkers">Clear markers</button>
    </div>

    <script>
      var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var labelIndex = 0;
      var waypoints = [];
      var directionsService;
      var directionsDisplay;
      var markers = [];
      var polylines = [];
      var map;
      var redrawButton = document.getElementById('redrawButton');
      var clearButton = document.getElementById('clearMarkers');
      var bounds;
      var circles = [];

      var colors = ['Maroon', 'Red', 'Orange', 'Yellow', 'Olive', 'Green', 'Purple', 'Teal', 'Navi', 'Lime', 'Aqua'];

    //   var sampleRoutes = [
    //     { start: { lat: 51.0944782, lng: 17.0153655 }, end: { lat: 51.1199982, lng: 17.0772734 }},
    //     { start: { lat: 51.1103805, lng: 17.0264187 }, end: { lat: 51.1058269, lng: 17.0473185 }},
    //     { start: { lat: 51.0909071, lng: 17.0176219 }, end: { lat: 51.1158872, lng: 17.060666 }},
    //     { start: { lat: 51.111539, lng: 17.0602789 }, end: { lat: 51.1176007, lng: 17.0897618 }},
    //     { start: { lat: 51.1171158, lng: 17.0419112 }, end: { lat: 51.1317415, lng: 17.0790758 }}
    //   ];

    var sampleRoutes = [
        { start: { lat: 51.0945354, lng: 16.9798706 }, end: { lat: 51.109828, lng: 17.0627203 }},
        { start: { lat: 51.098363, lng: 16.9994663 }, end: { lat: 51.1082687, lng:17.0376636 }}
    ];

      function initMap() {
        google.maps.Circle.prototype.contains = function(latLng) {
            return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
        }

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 6,
          center: {lat: 51.1092517, lng: 17.0391974}
        });

        directionsService = new google.maps.DirectionsService;

        sampleRoutes.forEach(function (route, i) {
            displayRoute(route.start, route.end, colors[i]);
        });

        setTimeout(function () {
            getPolylineIntersection();
        }, 1000);
      }

      function displayRoute(origin, destination, strokeColor) {
        
        var renderer = new google.maps.DirectionsRenderer({
            draggable: true,
            polylineOptions: {
                strokeColor: strokeColor,
                strokeWeight: 3
            },
            map: map
        });

        directionsService.route({
          origin: new google.maps.LatLng(origin),
          destination: new google.maps.LatLng(destination),
          // waypoints: [{location: 'plac Orląt Lwowskich, Wrocław'}, {location: 'Kazimierza Wielkiego, Wrocław'}],
          travelMode: 'DRIVING',
          avoidTolls: true
        }, function(response, status) {
          if (status === 'OK') {
            renderer.setDirections(response);
            createPolyline(response);
          } else {
            alert('Could not display directions due to: ' + status);
          }
        });
      }

      function drawCircle (lat, lng) {
          var circle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.3,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.05,
                map: map,
                center: {
                    lat: lat,
                    lng: lng
                },
                radius: 300
            });

            circles.push(circle);
      }

      function createPolyline (request) {
        var bounds = new google.maps.LatLngBounds();
        var polyline = new google.maps.Polyline({
            path: [],
            strokeColor: "#DD71D8",
            strokeWeight: 8
        });
        var path = request.routes[0].overview_path;
        var legs = request.routes[0].legs;
        // console.log('legs', legs)
        // console.log('path', path)

        for (i = 0; i < legs.length; i++) {
            var steps = legs[i].steps;
            for (j = 0; j < steps.length; j++) {
                var nextSegment = steps[j].path;
                for (k = 0; k < nextSegment.length; k++) {
                    polyline.getPath().push(nextSegment[k]);
                    bounds.extend(nextSegment[k]);

                    polylines.push(polyline);
                    // console.log(polylines);
                }
            }
        }
      }

      function getPolylineIntersection() {
        //   console.log(polylines);
          // polyline[1] - driverRoute, carPoolerRoutes of polylines are ride sharers
          var driverRoute = polylines[0]; // shift method affects polylines array and removes 1 element
          var carPoolerRoutes = polylines.slice(1,3);
        //   console.log('driverRoute', driverRoute);
        //   console.log('polylines', polylines);
        //   return;
        //   console.log(driverRoute, carPoolerRoutes);

          carPoolerRoutes.forEach(function (cpr) {
            var commonPts = [];
            // for (var i = 0; i < driverRoute.getPath().getLength(); i++) {
            //     for (var j = 0; j < cpr.getPath().getLength(); j++) {
            //         if (driverRoute.getPath().getAt(i).equals(cpr.getPath().getAt(j))) {
            //             commonPts.push({
            //                 lat: driverRoute.getPath().getAt(i).lat(),
            //                 lng: driverRoute.getPath().getAt(i).lng(),
            //                 route1idx: i
            //             });
            //             console.log(commonPts);
            //         }
            //     }
            // }
            // for (var i = 0; i < driverRoute.getPath().getLength(); i++) {
            //     // console.log('driverRoute.getPath().getLength()', driverRoute.getPath().getLength());

            //     cprPoints = [cpr.getPath().getAt(0), cpr.getPath().getAt(cpr.getPath().getLength() - 1)];
            //     // for (var j = 0; j < cpr.getPath().getLength(); j++) {
            //     console.log('cprPoints', cprPoints)

            //     cprPoints.forEach(function (point) {
                
            //         if (driverRoute.getPath().getAt(i).equals(point)) {
            //             // console.warn('eaquals')
            //             commonPts.push({
            //                 lat: driverRoute.getPath().getAt(i).lat(),
            //                 lng: driverRoute.getPath().getAt(i).lng(),
            //                 route1idx: i
            //             });
            //             console.log(commonPts);
            //         }
            //         // console.warn('not eaquals')
            //     });
            // }
            for (var i = 0; i < driverRoute.getPath().getLength(); i++) {
            
                if( i % 25 == 0) {
                    drawCircle(driverRoute.getPath().getAt(i).lat(), driverRoute.getPath().getAt(i).lng());
                }

                

                var cprPoints = [cpr.getPath().getAt(0), cpr.getPath().getAt(cpr.getPath().getLength() - 1)];
                // console.log('cprPoints', cprPoints)

                cprPoints.forEach(function (point) {
                
                    // if (driverRoute.getPath().getAt(i).equals(point)) {
                    //     commonPts.push({
                    //         lat: driverRoute.getPath().getAt(i).lat(),
                    //         lng: driverRoute.getPath().getAt(i).lng(),
                    //         routeId: i
                    //     });
                    //     console.log('commonPts', commonPts);
                    // }

                    // console.log('point', point)
                    // console.log('circle', circle)

                    circles.forEach(function (circle) {
                        // circle.contains(point);
                        // console.log('circle.contains(point);', circle.contains(point))
                        if (circle.contains(point)) {
                            console.log('point', point.lat())
                            var marker = new google.maps.Marker({
                                position: {lat: point.lat(), lng: point.lng()},
                                map: map,
                                animation: google.maps.Animation.DROP,
                                draggable: true
                            });
                        }
                    });
                });
            }
            // var path = [];
            // var prevIdx = commonPts[0].routeId;
            // for (var i = 0; i < commonPts.length; i++) {
            //     if (commonPts[i].routeId <= prevIdx + 1) {
            //         path.push(commonPts[i]);
            //         prevIdx = commonPts[i].routeId;
            //     } else {
            //         var polyline = new google.maps.Polyline({
            //             map: map,
            //             path: path,
            //             strokeWeight: 8,
            //             strokeColor: "#ff0000"
            //         });
            //         path = [];
            //         prevIdx = commonPts[i].routeId;
            //     }
            // }
            // var polyline = new google.maps.Polyline({
            //     map: map,
            //     path: path,
            //     strokeWeight: 8,
            //     strokeColor: "#ff0000"
            // });
          });
    }







      

    //   function save_waypoints() {
    //       var w=[],wp;
    //       var rleg = directionsDisplay.directions.routes[0].legs[0];
    //       data.start = {'lat': rleg.start_location.lat(), 'lng':rleg.start_location.lng()}
    //       data.end = {'lat': rleg.end_location.lat(), 'lng':rleg.end_location.lng()}
    //       var wp = rleg.via_waypoints 
    //       for(var i=0;i<wp.length;i++)w[i] = [wp[i].lat(),wp[i].lng()] 
    //       data.waypoints = w;
    //        
    //       var str = JSON.stringify(data)
    //    
    //       // $http.post('url', {data: str});
    //   }

    //   function set_route_from_waypoints (os) {
    //       var os = os || $http.get('url').then(function (data) { return data });

    //       var wp = [];
    //       for(var i=0;i<os.waypoints.length;i++)
    //           wp[i] = {'location': new google.maps.LatLng(os.waypoints[i][0], os.waypoints[i][1]),'stopover':false }
              
    //       directionsService.route({'origin':new google.maps.LatLng(os.start.lat,os.start.lng),
    //       'destination':new google.maps.LatLng(os.end.lat,os.end.lng),
    //       'waypoints': wp,
    //       'travelMode': google.maps.DirectionsTravelMode.DRIVING},function(res,sts) {
    //           if(sts=='OK')ren.setDirections(res);
    //       }) 
    //   }


    </script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBzjPLOcesc9ZWyxrj7ye0Fhp-HW0FEGN8&libraries=geometry&callback=initMap"></script>
  </body>
</html>