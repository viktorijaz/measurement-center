# Measurements center

Done in Rxjs and React, mimicking measurements center analytics dashboard that displays data about a medical operating room to doctors and nurses. It receives its data from three independent monitoring systems:

`Temperature`
`Air pressure`
`Humidity`

Each system sends randomly data every **100-2000ms**.

#### Requirement:

Display object should **not be emitted more often than every 100ms
Display object should only be emitted when one of the systems sends a new value
If a value is not received from a specific system for more than 1000ms, its reading (in the display object) should be 'N/A'
All 3 systems must emit at least one value before 1 display object is ever sent to the dashboard.


