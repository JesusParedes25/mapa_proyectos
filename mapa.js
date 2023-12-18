
var map = L.map('map', {
    center: [20.5791, -98.9621],
    zoom: 9,
    minZoom:8,
    maxZoom: 9 // Establece aquí el nivel máximo de zoom que desees
});


// Añadiendo la capa base al mapa
var tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Función para obtener el color en función del número de proyectos
function getColor(d) {
    return d > 29 ? 'black' :
           d > 17 ? '#006d2c' :
           d > 9  ? '#31a354' :
           d > 4  ? '#74c476' :
           d > 2  ? '#bae4b3' :
           d > 0  ? '#edf8e9' :
                    'white';
}

// Estilo para las áreas geográficas del mapa
function style(feature) {
    return {
        fillColor: getColor(feature.properties.Proyectos),
        weight: 1,
        opacity: 0.8,
        color: 'black',
        fillOpacity: 0.7
    };
}

// Resalta la característica bajo el mouse
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

// Restablece el resaltado al sacar el mouse
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

// Zoom al hacer clic en una característica
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// Eventos para cada característica
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Añadiendo las áreas geográficas al mapa
var geojson = L.geoJson(municipios_proyectos, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// Control de información
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

// Actualizar el control basado en las propiedades pasadas
info.update = function (props) {
    this._div.innerHTML = '<h4>Proyectos</h4>' +  (props ?
        'Municipio: <b>' + props.NOMGEO + '</b><br />' + 'Proyectos: <b>' + props.Proyectos + '</b>' :
        'Pasa el cursor sobre un municipio');
};

info.addTo(map);

// Función para mostrar proyectos en el panel
function mostrarProyectos(municipio) {
    var proyectos = proyectos1[municipio];
    var html = proyectos ? proyectos.map(function(proyecto) {
        return '<p>' + proyecto + '</p>';
    }).join('') : 'No hay proyectos para este municipio.';
    document.getElementById('panelProyectos').innerHTML = html;
}

// Evento para manejar cambios en el selector de municipios
document.getElementById('municipiosSelect').addEventListener('change', function() {
    var municipioSeleccionado = this.value;
    mostrarProyectos(municipioSeleccionado);
});
var customControl = L.control({position: 'topright'});

customControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'custom-control');
    // Aquí puedes incluir el HTML que necesitas para mostrar la información
    div.innerHTML = '<strong>Municipio:</strong><br>Información aquí...';
    return div;
};


// Obtener el modal
var modal = document.getElementById("modalProyectos");

// Obtener el elemento que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario selecciona un municipio, mostrar el modal con la información de los proyectos
document.getElementById('municipiosSelect').addEventListener('change', function() {
    var municipioSeleccionado = this.value;
    var proyectos = proyectos1[municipioSeleccionado];
    var html = proyectos ? proyectos.map(function(proyecto) {
        return '<p>' + proyecto + '</p>';
    }).join('') : 'No hay proyectos para este municipio.';
    
    document.getElementById('contenidoProyectos').innerHTML = html;
    modal.style.display = "block";
});

// Cuando el usuario hace clic en <span> (x), cerrar el modal
span.onclick = function() {
    modal.style.display = "none";
}

// Cuando el usuario hace clic en cualquier lugar fuera del modal, cerrarlo
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
