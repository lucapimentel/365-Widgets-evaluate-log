# Log File Sensor Evaluation
This repository contains a solution for processing log files containing sensor data and classifying devices based on specific criteria. The solution is implemented in TypeScript and focuses on efficiency, flexibility, and future scalability.

# Problem Statement
The task is to take the contents of a log file and output the devices along with their classifications. Devices are classified based on predefined criteria, such as temperature precision, humidity range, and carbon monoxide levels.

# Solution Overview
The solution is structured around three main functions:

* mapLogFileToSensorMetric: Parses the log file contents and maps them to sensor data objects.
* calculateDeviationAndMean: Calculates the mean and deviation of sensor readings.
* evaluateLogFile: Evaluates the sensor data and generates device classifications.
Usage
To use the solution, follow these steps:

Import the required types and functions from the provided TypeScript files.
Read the log file contents.
Call the evaluateLogFile function to generate device classifications.
Code Structure
The solution is organized into TypeScript modules:

* types.ts: Contains the type definitions used throughout the solution, including sensor types, data structures, and evaluation statuses.
* Utils/util.ts: Includes utility functions for calculating deviation and mean, as well as mapping log files to sensor data.
* evaluateLogFile.ts: Implements the main logic for evaluating the log file and classifying devices.

# Getting Started
To use the solution, follow these steps:

* Clone this repository to your local machine.
* Install TypeScript and required dependencies using npm install.
* Modify the logContentsStr variable in index.ts with your log file contents.
* Run the TypeScript compiler with npm run build to transpile the code.

## License

[MIT](https://choosealicense.com/licenses/mit/)