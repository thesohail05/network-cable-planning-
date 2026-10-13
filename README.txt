NETWORK CABLE PLANNING TOOL
===========================

PROJECT OVERVIEW
A simple browser-based mini project to plan network cable connections and estimate how much cable is required.

FEATURES
- Add source and destination devices
- Select Cat5e, Cat6, or fiber optic cable
- Calculate cable requirement with extra allowance
- View total cable runs and total cable length
- Remove a planned connection
- Load sample data
- Export the plan to CSV
- Warn when a copper Ethernet cable run exceeds 100 meters

HOW TO RUN
1. Extract Network_Cable_Planning.zip.
2. Open the Network_Cable_Planning folder.
3. Double-click index.html.
4. It opens in Chrome, Edge, or another modern browser.
5. Enter connection details and click "Add cable run".

TECHNOLOGIES
HTML, CSS, JavaScript. No installation or server is required.

FORMULA
Required cable length = Measured distance × (1 + Extra allowance / 100)

EXAMPLE
Measured distance = 20 m
Extra allowance = 10%
Required cable = 20 × 1.10 = 22 m

NOTE
This is an educational planning estimator. Verify actual routes and network requirements before installing cables.
