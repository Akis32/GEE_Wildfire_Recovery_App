var S2 = ee.ImageCollection("COPERNICUS/S2_SR"),
    LISB = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017"),
    Corine = ee.Image("COPERNICUS/CORINE/V20/100m/2018"),
    geometry = /* color: #ffff00 */ee.Geometry.MultiPoint();



//*********************************************INPUTS****************************************************************//
//Reference image collection start
var RF_Date_Start_Input = ui.Textbox({
  placeholder: "Enter start date (yyyy-mm-dd)",
  style: { width: '200px' }
});


//Current image collection start
var CS_Date_End_Input = ui.Textbox({
  placeholder: "Enter end date (yyyy-mm-dd)",
  style: { width: '200px' }
});


//*********************************************GENERAL FUNCTIONS AND VARIABLES****************************************************************//

//******************************************************Input processing
RF_Date_Start_Input.onChange(updateSelectedDates);
CS_Date_End_Input.onChange(updateSelectedDates);

// Function to validate and process user input
function processUserInput(input) {
  var datePattern = /^([0-9]{4})-(0[1-9]|1[0-2])-([0-9]{2})$/;
  if (datePattern.test(input)) {
    return input; // Return the input date as is
  } else {
    return null;
  }
}

// Function to update selected dates
function updateSelectedDates() {
  var startInput = RF_Date_Start_Input.getValue();
  var endInput = CS_Date_End_Input.getValue();
  
  var formattedStart = processUserInput(startInput);
  var formattedEnd = processUserInput(endInput);
  
  if (formattedStart && formattedEnd) {
    print("Selected Start Date:", formattedStart);
    print("Selected End Date:", formattedEnd);
    // Use the formatted dates for further processing
  } else {
    print("Invalid date format. Please use yyyy-mm-dd format.");
  }
}

// Remove layers
function removelay(){
  
  var lay = Map.layers().get(0);
  if(lay){
  Map.remove(lay)}

  else{print('layer missing')}
  
}

//Add NDVI function
var addNDVI = function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};

//Add NBR function
var addNBR = function(image) {
  var nbr = image.normalizedDifference(['B8','B12']).rename('NBR');
  return image.addBands(nbr);
};

//Get the drawing tools widget object,
//define it as a variable for convenience in recalling it later.
var drawingTools = Map.drawingTools();

drawingTools.setShown(true);

//Setup a while loop to clear all existing geometries 
//that have been added as imports from drawing tools 
//(from previously running the script).
while (drawingTools.layers().length() > 0) {
  var layer = drawingTools.layers().get(0);
  drawingTools.layers().remove(layer);
}

//Initialize a dummy GeometryLayer with null geometry 
//to act as a placeholder for drawn geometries.
var dummyGeometry =
    ui.Map.GeometryLayer({geometries: null, name: 'geometry', color: '#FFFF00'});

drawingTools.layers().add(dummyGeometry);


//Define the geometry clearing function.
function clearGeometry() {
  var layers = drawingTools.layers();
  layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
}

//Define functions that will be called when 
//each respective drawing button is clicked.
function drawRectangle() {
  clearGeometry();
  drawingTools.setShape('point');
  drawingTools.draw();
}

// Function to mask clouds
function s2ClearSky(image) {
      var scl = image.select('SCL');
      var clear_sky_pixels = scl.eq(1).or(scl.eq(2)).or(scl.eq(3)).or(scl.eq(4)).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7)).or(scl.eq(10)).or(scl.eq(11));
      return image.updateMask(clear_sky_pixels);
}

//Creates a color bar thumbnail image for use in legend from the given color palette.
function makeColorBarParams(palette) {
  return {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette,
  };
}

//Visualization
var Viz_AG = {min:0,max:6000,bands:['B12','B8','B4']}; 
var Viz_AG_smooth = {min:0,max:6000,bands:['B12_moving_average','B8_moving_average','B4_moving_average']};
var Viz_RGB = {min:0, max:4000,bands:['B4', 'B3', 'B2']};
var Viz_CI = {min:0, max:7000,bands:['B8', 'B4', 'B3']};
var Viz_DNBR = {min:-1, max:1,palette:'#16537e, #45818e, #d7b98a, #f44336, #990000'};


var countryList = [
  "Afghanistan",
  "Aksai Chin",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua & Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Ashmore & Cartier Is",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas, The",
  "Bahrain",
  "Baker Island",
  "Bangladesh",
  "Barbados",
  "Bassas da India",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bir Tawil",
  "Bolivia",
  "Bosnia & Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burma",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Clipperton Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Cook Islands",
  "Coral Sea Islands",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Dhekelia",
  "Dem Rep of the Congo",
  "Demchok Area",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Dragonja River Mouth",
  "Dramana-Shakatoe Area",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Europa Island",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French S & Antarctic Lands",
  "Gabon",
  "Gambia, The",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Glorioso Island",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See",
  "Honduras",
  "Hong Kong",
  "Howland Island",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Jan Mayen",
  "Japan",
  "Jarvis Island",
  "Jersey",
  "Johnston Atoll",
  "Jordan",
  "Juan de Nova Island",
  "Kazakhstan",
  "Kenya",
  "Kingman Reef",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Koualou Area",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Liancourt Rocks",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Madeira Islands",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia (Federated States of)",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nauru",
  "Navassa Island",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palmyra Atoll",
  "Panama",
  "Papua New Guinea",
  "Paracel Islands",
  "Paraguay",
  "Peru",
  "Pitcairn Islands",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome & Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Siachen-Saltoro Area",
  "Sierra Leone",
  "Singapore",
  "Sinafir & Tiran Is.",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Spain (Africa)",
  "Spain (Canary Is)",
  "Spratly Islands",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad & Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "U.S. Virgin Islands",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States (Alaska)",
  "United States (Hawaii)",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Wake Island",
  "Wallis & Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

var selectedCountry = "Greece";

var Country_select = LISB.filter(ee.Filter.equals('country_na', selectedCountry));

function updateSelectedCountry(selectedCountry) {

  // Update the Country_select variable
  Country_select = LISB.filter(ee.Filter.equals('country_na', selectedCountry));}
  
//Land Cover

var CorineLC2018 = Corine.select('landcover');

var LCdict =
  {
  111: "Continuous urban fabric",
  112: "Discontinuous urban fabric",
  121: "Industrial or commercial units",
  122: "Road and rail networks and associated land",
  123: "Port areas",
  124: "Airports",
  131: "Mineral extraction sites",
  132: "Dump sites",
  133: "Construction sites",
  141: "Green urban areas",
  142: "Sport and leisure facilities",
  211: "Non-irrigated arable land",
  212: "Permanently irrigated land",
  213: "Rice fields",
  221: "Vineyards",
  222: "Fruit trees and berry plantations",
  223: "Olive groves",
  231: "Pastures",
  241: "Annual crops associated with permanent crops",
  242: "Complex cultivation patterns",
  243: "Land principally occupied by agriculture, with significant areas of natural vegetation",
  244: "Agro-forestry areas",
  311: "Broad-leaved forest",
  312: "Coniferous forest",
  313: "Mixed forest",
  321: "Natural grasslands",
  322: "Moors and heathland",
  323: "Sclerophyllous vegetation",
  324: "Transitional woodland-shrub",
  331: "Beaches, dunes, and sand plains",
  332: "Bare rocks",
  333: "Sparsely vegetated areas",
  334: "Burnt areas",
  335: "Glaciers and perpetual snow",
  411: "Inland marshes",
  412: "Peat bogs",
  421: "Salt flats",
  422: "Salines",
  423: "Intertidal flats",
  511: "Water courses",
  512: "Water bodies",
  521: "Coastal lagoons",
  522: "Estuaries",
  523: "Sea and ocean",
  999: "NODATA",
  };
  
//****************************************MAIN FUNCTIONS***************************************************//

function model(){
  
  legendPanel.clear();
  resultsPanel.clear();
  
  

  var RF_Date_Start_format = processUserInput(RF_Date_Start_Input.getValue());
  var CS_Date_End_format = processUserInput(CS_Date_End_Input.getValue());
  
  var RF_Date_End_format = ee.Date(RF_Date_Start_format).advance(1,'month');
  var CS_Date_Start_format = ee.Date(CS_Date_End_format).advance(-1,'month');
  
  //Clip land Cover
  var CorineLC2018_Clip = CorineLC2018.clip(Country_select);
  
  //Current NBR
  var collection_CS = S2.filterDate(CS_Date_Start_format, CS_Date_End_format)
      .sort('CLOUDY_PIXEL_PERCENTAGE', false)
      .filterBounds(Country_select);
      
  var CS_Img = ee.Image(collection_CS.mosaic()).clip(Country_select);

  var NBR_CS = CS_Img.normalizedDifference(['B8','B12']);

  //Posfire NBR
  var collection_PF = S2.filterDate(RF_Date_Start_format,RF_Date_End_format).sort('CLOUDY_PIXEL_PERCENTAGE', false).filterBounds(Country_select);
  var PF_Img = ee.Image(collection_PF.mosaic()).clip(Country_select);

  var NBR_PF = PF_Img.normalizedDifference(['B8','B12']);

  //DNBR Calculation
  var DNBR = NBR_PF.subtract(NBR_CS);

  //Zoom Country
  Map.centerObject(Country_select);

  //Layer to add on the map
  removelay();
  removelay();
  removelay();
  removelay();
  removelay();

  Map.addLayer(DNBR,Viz_DNBR,'DNBR',false);
  Map.addLayer(PF_Img,Viz_AG,'(SWIR-NIR-Red) Reference period');
  Map.addLayer(CS_Img,Viz_AG,'(SWIR-NIR-Red) Current state');
  Map.addLayer(CorineLC2018_Clip, {}, 'Land Cover',false);

  // Create legend title
  var legendTitle_DNBR= ui.Label({
    value: 'Fire impact (DNBR index)',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '0 0 4px 0',
      padding: '0'
      }
  });

// Create the DNBR color bar for the legend.
  var legendLabels_DNBR = ui.Panel({
    widgets: [
    ui.Label('Regrowth', {margin: '4px 8px'}),
    ui.Label('Burn scar', {margin: '4px 8px',textAlign: 'right', stretch: 'horizontal'})
    ],
    layout: ui.Panel.Layout.flow('horizontal')
  });
  
    
  var colorBar_DNBR = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: makeColorBarParams(Viz_DNBR.palette),
    style: {stretch: 'horizontal', margin: '0px 8px', maxHeight: '24px'},
  });

  var legendPanel_DNBR = ui.Panel([legendTitle_DNBR, colorBar_DNBR, legendLabels_DNBR]);
  
  legendPanel.widgets().set(3, legendPanel_DNBR);
  
}

function Timeseries(){
  
  resultsPanel.clear();
  ExportPanel.clear();
  coordinatepanel.clear();
  
  ExportPanel.add(ui.Label({
    value: "Export CSV Files list",
    style: { fontWeight: "bold" }
  }));

  
  var AOI = drawingTools.layers().get(0).getEeObject();
  print (AOI)
  
  var Date_Start = processUserInput(RF_Date_Start_Input.getValue());
  var Date_End = processUserInput(CS_Date_End_Input.getValue());
  
  var collection = S2.filterDate(Date_Start,Date_End)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .filter(ee.Filter.bounds(AOI))
  .map(s2ClearSky)
  .map(addNDVI)
  .map(addNBR);
  
  //Moving window smoothing
  // Specify the time-window
  var days = 15;

  // Convert to milliseconds 
  var millis = ee.Number(days).multiply(1000*60*60*24);

  //Select the type of join
  var join = ee.Join.saveAll({
  matchesKey: 'images'
  });

  //Create a filter
  var diffFilter = ee.Filter.maxDifference({
  difference: millis,
  leftField: 'system:time_start', 
  rightField: 'system:time_start'
  });
  
  //Apply filter to image join
  var joinedCollection = join.apply({
  primary: collection, 
  secondary: collection, 
  condition: diffFilter
  });
  
  // Each image in the joined collection will contain
  // matching images in the 'images' property
  // Extract and return the mean of matched images
  var extractAndComputeMean = function(image) {
    var matchingImages = ee.ImageCollection.fromImages(image.get('images'));
    var meanImage = matchingImages.reduce(
      ee.Reducer.median().setOutputs(['moving_average']));
    return ee.Image(image).addBands(meanImage);
  };

  var smoothedCollection = ee.ImageCollection(
    joinedCollection.map(extractAndComputeMean));
  
  // Display NDVI time-series chart
  var chartNDVI = ui.Chart.image.series({
    imageCollection: smoothedCollection.select('NDVI_moving_average'),
    region: AOI,
    reducer: ee.Reducer.mean(),
    scale: 10
  }).setOptions({
        title: 'NDVI Time Series',
        interpolateNulls: true,
        vAxis: {title: 'NDVI', viewWindow: {min: -1, max: 1}},
        hAxis: {title: '', format: 'YYYY-MM', gridlines: {count: 6}},
        lineWidth: 1,
        pointSize: 4,
        series: {
          0: {color: '#238b45'},
      },
      
  });
      
  // Display NBR time-series chart
  var chartNBR = ui.Chart.image.series({
    imageCollection: smoothedCollection.select('NBR_moving_average'),
    region: AOI,
    reducer: ee.Reducer.mean(),
    scale: 10
  }).setOptions({
        title: 'NBR Time Series',
        interpolateNulls: true,
        vAxis: {title: 'NBR', viewWindow: {min: -1, max: 1}},
        hAxis: {title: '', format: 'YYYY-MM',gridlines: {count: 6}},
        lineWidth: 1,
        pointSize: 4,
        series: {
          0: {color: '#FF4C4C'},
      }
      
    });
  
  resultsPanel.add(ui.Label({
    value: "Click on timeseries to visualize the source S2 image",
    style: { fontWeight: "bold" }
  }));
    
  resultsPanel.add(chartNDVI);
  resultsPanel.add(chartNBR);
  
  // When the chart is clicked, update the map and label.
  chartNDVI.onClick(function(xValue, yValue, seriesName) {
    if (!xValue) return;  // Selection was cleared.

  // Show the image for the clicked date.
    var equalDate = ee.Filter.equals('system:time_start', xValue);
    var image = ee.Image(smoothedCollection.filter(equalDate).first());
    var lay = Map.layers().get(4);
    if(lay){Map.remove(lay)}
    Map.addLayer(image,Viz_AG_smooth,'Image from timeseries');
  });
  
   chartNBR.onClick(function(xValue, yValue, seriesName) {
    if (!xValue) return;  // Selection was cleared.

  // Show the image for the clicked date.
    var equalDate = ee.Filter.equals('system:time_start', xValue);
    var image = ee.Image(smoothedCollection.filter(equalDate).first());
    var lay = Map.layers().get(4);
    if(lay){Map.remove(lay)}
    Map.addLayer(image,Viz_AG_smooth,'Image from timeseries');
  });
  
  
  //Add Land Cover info
  var landCover = CorineLC2018.reduceRegion({
      geometry: AOI,
      scale: 10,
      reducer: ee.Reducer.first()});
      
  
  
  var LabelLC = landCover.evaluate(function(result) {
    
    var LandCoverText = ui.Label({
        value: "Pixel Land Cover: " +result.landcover + " " + LCdict[result.landcover],
        style: {
          fontWeight: "bold",
          fontSize: "14px",
          margin: "10px"
        }
      });
  
    resultsPanel.add(LandCoverText);
  });
  
  //--------------------------------------------Eport to CSV------------------------------------//

  //NDVI conversion to get the values function
  var NDVIfeature_series = function(img){
    var date = img.get('system:time_start');
    var value = img.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: AOI,
      scale: 10}
      ).get('NDVI_moving_average');
    var feature = ee.Feature(null, {'system:time_start': date, 
                            'date': ee.Date(date).format('Y/M/d'), 
                            'value': value});
    return feature;
  };
  
  // Apply the timeseries mapping function to each image in smoothered colection
  var NDVI_ts = smoothedCollection.map(NDVIfeature_series);
  
  var downloadNDVIUrl = ee.FeatureCollection(NDVI_ts).getDownloadURL({
    format: 'CSV',
    filename: 'NDVI timeseries',
    selectors: ['date', 'value']
    });
  
  var labelNDVI= ui.Label('NDVI timeseries CSV download');
  labelNDVI.setUrl(downloadNDVIUrl);
  labelNDVI.style().set({shown: true});
  
  ExportPanel.add(labelNDVI);

  
  //NBR conversion to get the values function
  var NBRfeature_series = function(img){
    var date = img.get('system:time_start');
    var value = img.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: AOI,
      scale: 10}
      ).get('NBR_moving_average');
    var feature = ee.Feature(null, {'system:time_start': date, 
                            'date': ee.Date(date).format('Y/M/d'), 
                            'value': value});
    return feature;
  };
  
  // Apply the timeseries mapping function to each image in smoothered colection
  var NBR_ts = ee.FeatureCollection(smoothedCollection.select('NBR_moving_average').map(NBRfeature_series));
  

  var downloadNBRUrl = NBR_ts.getDownloadURL({
    format: 'CSV',
    filename: 'NBR timeseries',
    selectors: ['date', 'value']
    });
  
  var labelNBR= ui.Label('NBR timeseries CSV download');
  labelNBR.setUrl(downloadNBRUrl);
  labelNBR.style().set({shown: true});
  
  ExportPanel.add(labelNBR);
  
  //Show coordinates
  var coortext =  ui.Label({
    value: 'Point Coordinates',
    style: { fontWeight: 'bold' }
  });
  
  var lon =  ui.Label().setValue('long: '+ee.String(AOI.coordinates().get(0)).slice(0,8).getInfo());
  var lat =  ui.Label().setValue('lat: '+ee.String(AOI.coordinates().get(1)).slice(0,8).getInfo());
  
  coordinatepanel.add(coortext);
  coordinatepanel.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));
  // // Export the NBR time-series as a video
  // var nbrVis = {min:-0.7, max: 0.7,  palette: palette1};

  // Map.centerObject(AOI, 16);
  // var bbox = Map.getBounds({asGeoJSON: true});

  // var visualizeImage = function(image) {
  //   return image.visualize(nbrVis).clip(bbox).selfMask();
  // };

  // var visCollectionSmoothed = smoothedCollection.select('NBR_moving_average')
  // .map(visualizeImage);
  
  // Export.video.toDrive({
  //   collection: visCollectionSmoothed,
  //   description: 'NBR_Time_Series',
  //   folder: 'earthengine',
  //   fileNamePrefix: 'NBR',
  //   framesPerSecond: 2,
  //   dimensions: 800,
  //   region: bbox});
    
  // print(smoothedCollection);

 }
//*********************************************UI**********************************************************//


//*************************PANELS
// Add main panel
var panel = ui.Panel({
  style: {
    backgroundColor: 'white',
    border: '1px solid black',
    padding: '10px',
    width: '300px',
    position:'middle-left'
  }
});

Map.add(panel);


//Create a legend panel
var legendPanel = ui.Panel({
  style: {
    backgroundColor: 'white',
    border: '1px solid black',
    padding: '10px',
    width: '300px',
    position:'bottom-left'
  }
});

Map.add(legendPanel);


//Export panel
var ExportPanel = ui.Panel({
  style: {
    backgroundColor: 'white',
    border: '1px solid black',
    padding: '10px',
    width: '300px',
    position:'top-right'
  }
});

Map.add(ExportPanel);

//Country selection dropdown list
var countrySelect = ui.Select({
  items: countryList,
  placeholder: 'Select a country',
  onChange: updateSelectedCountry,
  style: {
    height:'50px',
    fontWeight:'50px'
  }
  
});

panel.add(countrySelect);

//Create a results panel
var resultsPanel = ui.Panel({
  style: {
    backgroundColor: 'white',
    border: '1px solid black',
    padding: '5px',
    width: '500px',
    position:'bottom-right'
  }
});

Map.add(resultsPanel);

//Create a results panel
var coordinatepanel = ui.Panel({
  style: {
    backgroundColor: 'white',
    position:'top-center'
  }
});

Map.add(coordinatepanel);


//Define a ui.Panel to hold 
//app instructions and the geometry drawing buttons.

var controlPanel = ui.Panel({
  widgets: [
    ui.Label('Draw/Erase a point to view timeseries'),
    ui.Button({
      label: ' Point',
      onClick: drawRectangle,
      style: {stretch: 'horizontal',Color:'#4863A0'}
    }),
    ],
  style: {position: 'top-left'},
  layout: null,
});

Map.add(controlPanel);

//Date inputs
panel.add(ui.Label({
  value: "Select start and end date",
  style: { fontWeight: "bold" }
}));


panel.add(RF_Date_Start_Input);


panel.add(CS_Date_End_Input);

//Model run button
var model_run = ui.Button({
  label: "Run model",
  onClick: model, // Call the displayAFImage function
  style: {
    stretch: "horizontal",
    height:'50px',
    fontWeight:'50px',
    Color:'#4863A0'
  }
});

panel.add(model_run);

// Create timeseries button
var TimeseriesButton = ui.Button({
  label: "Create timeseries",
  onClick: Timeseries,
  style: {
    stretch: "horizontal",
    height:'50px',
    fontWeight:'50px',
    Color:'#4863A0'
  }
});

panel.add(TimeseriesButton);
