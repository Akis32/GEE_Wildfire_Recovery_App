# Wildfire Recovery Application - [Link](https://ee-my-username32blue.projects.earthengine.app/view/wildfire-recover)

This repository contains the web-based application "Wildfire Impact" for analyzing the impact of fires using Google Earth Engine and Google Earth Engine's user interface (UI). Harnessing the power of Google Earth Engine, the "Wildfire Impact" application is designed to visualize, identify, and calculate the recovery from wildfires worldwide from Sentinel-2 images, in a matter of seconds.

**Click the image below for the model workflow demo**
[![WildfireImpactDemo](https://img.youtube.com/vi/hG2sv7bSYec/maxresdefault.jpg)](https://www.youtube.com/watch?v=e6U0JWRmj84&ab_channel=akisch)
### Development team: 
[Minas Chatzigeorgiadis](https://www.linkedin.com/in/minas-chatz/), [Dr Thanos Doganis](https://www.linkedin.com/in/thanos-doganis-41550915/) and [Io Dogani](https://www.linkedin.com/in/dogani-io/), GIS Lab research team of [MSc Climate ICT](https://masters.ds.unipi.gr/MSc_Climate_ICT/en/) of [University of Piraeus](https://www.unipi.gr/unipi/en/)
_______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

## Summary

Explore the recovery after wildfires using the "Wildfire Recovery" application tool which allows you to:

- **Input Parameters**: Define date ranges for reference and curent satellite imagery to analyze the recovery of forest areas within specific timeframes.

- **Pont of Interest (POI)**: Easily create POIs using intuitive drawing tools for precise analysis of wildfire recovery in chosen regions.

- **Wildire Recovbery Classification**: The tool calculates the dNBR index and categorizes wildfire recovery into classes: Enhance Regrowth High, Enhance Regrowth High, Unburned, and Burn Scar, each represented with a unique color.

- **Timeseries charts**: The application creates timeseries charts for NBRI and NDVI to estimete the POI recovery from wildfire.

## How It Works

The tool operates in two steps:

1. **Data Collection and Visualize Impact**: Select the country of interest and specify the curen and reference image collection periods. The tool uses this data to calculate the NBR and NDV index, identifying areas recovering from wildfires.

2. **POI Analysis**: Define an AOI, and the tool provides NBR and NDVI timeseries statistics identifing the user for the land cover of the POI from Corine 2018 (For EU).

Whether you're a researcher, land manager, or concerned citizen, the Wildfire Recovery Analysis Tool offers a powerful and accessible way to assess the recovery from wildfires and make informed decisions based on satellite data.

## Table of Contents

- [Model Workflow](#model-workflow)
- [POI Impact Analysis](#aoi-impact-analysis)


## Model Workflow

The workflow to run the visualization model:

- **Step 1:** Define the country you are interested to calculate the wildfire impact from the dropdown list
- **Step 2:** Define the reference image collecton period. This the time period that the model will use to extract and compose reference images for further calculations and visualization. The start and end dates must be inputed in the form of yyyy-mm-dd (eg. 2023-09-01), it is good practice to define a period greater than 10 days to ensure image availability
- **Step 3:**  Define the curent image collecton period. This the time period that the model will use to extract and compose curent images for further calculations and visualization. The start and end dates must be inputed in the form of yyyy-mm-dd (eg. 2023-09-01). Try to define a period before the wildfire greater than 30 days to ensure image availability.
- **Step 4:** Press "Run model" button
- **Step 5:** Browse through the layers from the Legend option.
   The model produces 4 layers on the map:
  - Classified DNBR Index tht classifies it in 4 categories Enhance Regrowth High, Enhance Regrowth High, Unburned, and Burn Scar.
  - Reference SWIR-NIR-Red Band combination that enables rapid visualization of burn scars and identification of cloud coverage.
  - Curent  that enables burn scar comparisons and identification of cloud coverage.
  - Corine 2018 (For EU)


## POI Impact Analysis

The Wildfire Recovery application enables for furter analysis of user defined Proint Of Interst (POI). To asses the wildfire recovery for specific regions:

- **Step 1:** Define the POI from the custom Drawing Tools. Click on "Point" button and draw on the map to specify the POI. Click a second time on the "Point" button to reset the point geometry an define a defferent POI.
- **Step 2:** Click on the "Create timeseries" button
- **Step 3:** The timeseries results will pop up
    - DNBR timeseries chart for POI
    - NDVI timeseries chart for POI
    - Info for the land cover of POI (for EU)
- **Step 4:** Click on timeseries to import the source Image on the map and explore SWIR-NIR-Red Band combination
- **Step 5:** Use the pan icon to exit drawing mode an navigate on the map

