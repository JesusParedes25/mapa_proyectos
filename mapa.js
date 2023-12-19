
var map = L.map('map', {
    center: [20.5791, -98.9621],
    zoom: 9,
    zoomControl: false,
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
var info = L.control({ position: 'topright' });
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h4>Proyectos</h4>' + (props ?
        'Municipio: <b>' + props.NOMGEO + '</b><br />' + 'Proyectos: <b>' + props.Proyectos + '</b>' :
        'Pasa el cursor sobre un municipio');
};
info.addTo(map);
// Selectores para municipios y dependencias
var selectorMunicipio = document.getElementById('selectorMunicipio');
var selectorDependencia = document.getElementById('selectorDependencia');

// Rellenar selector de municipios con opciones
Object.keys(proyectos_filtros).forEach(function(municipio) {
    var option = document.createElement('option');
    option.value = municipio;
    option.textContent = municipio;
    selectorMunicipio.appendChild(option);
});

// Evento al cambiar selección de municipio
selectorMunicipio.addEventListener('change', function() {
    var dependencias = proyectos_filtros[this.value] || {};
    selectorDependencia.innerHTML = '<option value="">-- Selecciona una dependencia --</option>'; // Limpiar y establecer opción por defecto
    Object.keys(dependencias).forEach(function(dependencia) {
        var option = document.createElement('option');
        option.value = dependencia;
        option.textContent = dependencia;
        selectorDependencia.appendChild(option);
    });
    filtrarYMostrarProyectos(); // Actualizar proyectos
});

// Función para filtrar y mostrar proyectos
function filtrarYMostrarProyectos() {
    var municipioSeleccionado = selectorMunicipio.value;
    var dependenciaSeleccionada = selectorDependencia.value;

    // Filtrar proyectos basado en los selectores
    var proyectosFiltrados = proyectos_filtros[municipioSeleccionado] && proyectos_filtros[municipioSeleccionado][dependenciaSeleccionada] 
        ? proyectos_filtros[municipioSeleccionado][dependenciaSeleccionada] 
        : [];

    // Actualizar el contenido del div resultadosProyectos
    var html = proyectosFiltrados.map(function(proyecto) {
        return '<div class="proyecto-container">' +
                    '<div class="proyecto-nombre">' + proyecto['Proyecto'] + '</div>' +
                    '<div class="proyecto-porcentaje">' + Math.round(proyecto['Porcentaje de avance'] * 100) + '%</div>' +
                '</div>';
    }).join('');
    document.getElementById('resultadosProyectos').innerHTML = html;
}

selectorDependencia.addEventListener('change', filtrarYMostrarProyectos);

// Dispara un evento 'change' para cargar las opciones de dependencia al inicio
if (selectorMunicipio.options.length > 0) {
    selectorMunicipio.dispatchEvent(new Event('change'));
}
;

//Boton de abrir y cerrar
document.addEventListener('DOMContentLoaded', function() {
    var sidebar = document.getElementById('sidebar');
    var mapElement = document.getElementById('map');
    var toggleButton = document.getElementById('toggleSidebar');
    
    toggleButton.addEventListener('click', function() {
      var isOpen = sidebar.style.left === '0px';
      
      if (isOpen) {
        sidebar.style.left = '-300px'; // Esconde la barra lateral
        mapElement.style.left = '0'; // Extiende el mapa
        toggleButton.textContent = 'Abrir panel de información'; // Cambia el texto del botón
        toggleButton.style.left = '10px'; // Mueve el botón hacia la izquierda
      } else {
        sidebar.style.left = '0px'; // Muestra la barra lateral
        mapElement.style.left = '300px'; // Restablece el mapa
        toggleButton.textContent = 'Cerrar'; // Cambia el texto del botón
        toggleButton.style.left = '310px'; // Mueve el botón junto con la barra lateral
      }
  
      // Ajusta el tamaño del mapa después de la transición
      setTimeout(function() {
        map.invalidateSize();
      }, 300);
    });
  
    // Inicializa el estado del sidebar y botón
    sidebar.style.left = '0px'; // Barra lateral visible
    mapElement.style.left = '300px'; // Espacio para la barra lateral
    toggleButton.style.left = '310px'; // Botón se mueve con la barra lateral
  });
  