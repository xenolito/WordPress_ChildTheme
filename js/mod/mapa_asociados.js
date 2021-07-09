;(function ($) {
    if ($('#mapa_transporte').length > 0) {
        // GET WINDOW DIMENSIONS
        const winDim = () => {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        }

        const mapOptions = {
            zoom: 19,
            // center: new google.maps.LatLng(40.430484, -3.685376),
            // center: { lat: 40.430484, lng: -3.685376 },
            center: { lat: 40.4302272, lng: -3.6863704 },
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map'],
            },
        }

        const svgMarker = {
            path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
            fillColor: 'black',
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
            labelOrigin: new google.maps.Point(12, -2.5),
        }

        const styledMapType = new google.maps.StyledMapType(
            [
                { elementType: 'geometry', stylers: [{ color: '#f2dcd4' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#c38f7d' }],
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#447530' }],
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#F3BDAA' }],
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'geometry',
                    stylers: [{ color: '#F3BDAA' }],
                },
                {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#b9d3c2' }],
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#92998d' }],
                },
                {
                    featureType: 'poi.business',
                    stylers: [{ visibility: 'off' }],
                },
                {
                    featureType: 'poi.government',
                    stylers: [{ visibility: 'off' }],
                },
                {
                    featureType: 'poi.medical',
                    stylers: [{ visibility: 'off' }],
                },
                {
                    featureType: 'poi.school',
                    stylers: [{ visibility: 'off' }],
                },
                {
                    featureType: 'poi.place_of_worship',
                    stylers: [{ visibility: 'off' }],
                },
                {
                    featureType: 'poi.attraction',
                    stylers: [{ visibility: 'off' }],
                },
            ],
            { name: 'Styled Map' }
        )

        const mapElement = document.getElementById('aMap')

        const map = new google.maps.Map(mapElement, mapOptions)

        const updateMapZoom = () => {
            let z = 18.5
            if (winDim().width <= 890) {
                z = 16.5
            } else {
                z = 18.5
            }
            map.setZoom(z)
            return z
        }

        window.onresize = () => {
            updateMapZoom()
        }

        map.mapTypes.set('styled_map', styledMapType)
        map.setMapTypeId('styled_map')

        const markersArray = []

        const urls = []
        const icons = []

        document.querySelectorAll('#mapa_transporte locations url').forEach((e) => {
            urls.push({
                url: e.getAttribute('data-attr'),
                title: e.getAttribute('data-attr-name'),
                claim: e.getAttribute('data-attr-claim'),
                btntxt: e.getAttribute('data-attr-bt'),
                logo: e.getAttribute('data-attr-logo-url'),
            })
            // console.log(e.getAttribute('data-attr'))
            // return e.getAttribute('data-attr-url')
        })

        // console.log(urls)

        const origMarkers = urls.map((obj, index) => {
            const regex = new RegExp('@(.*),(.*),')
            const lon_lat_match = obj.url.match(regex)
            let latitude = lon_lat_match
            if (latitude && latitude[1] && latitude[2]) {
                return {
                    lat: latitude && latitude[1] ? latitude[1] : null,
                    lon: latitude && latitude[2] ? latitude[2] : null,
                    name: obj.title,
                    link: obj.url,
                    claim: obj.claim,
                    btntxt: obj.btntxt,
                    logo: obj.logo,
                }
            } else {
                // console.log('NO HAY DATOS MAPA: ' + obj.title)
                return null
            }
        })

        const mapMarkers = origMarkers.filter((el) => el != null)
        const infowindow = new google.maps.InfoWindow({
            content: '',
        })

        mapMarkers.forEach((m, index) => {
            // const location = new google.maps.LatLng(m.lon, m.lat)

            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(m.lat, m.lon),
                icon: svgMarker,
                map: map,
                content: 'hola que ase',
                label: {
                    text: m.name,
                    // fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, "Courier New", Courier,Monospace',
                    color: 'black',
                },
            })

            marker.addListener('click', () => {
                infowindow.setContent(
                    // `<div><div class="gmap-header"><img src="${m.logo}"><strong>${m.name}</strong></div class="desc">${m.claim}<br><a href="${m.link}" target="_blank">${m.btntxt}</a></div>`
                    `<div class="info-cont"><img src="${m.logo}"><div class="desc">${m.claim}</div><div><a class="no-underline" href="${m.link}" target="_blank">${m.btntxt}</a></div></div>`
                )
                infowindow.open(map, marker)
            })
            // console.log(typeof m.lat, m.lon)
        })

        updateMapZoom()
    }
})(jQuery)
