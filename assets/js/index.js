/********************* Settings *********************/

const STATIONS = [
    { stopID: "D18", feed: "nyct/gtfs-bdfm", routes: ["F", "M"], walkMinutes: 0 },
    { stopID: "634", feed: "nyct/gtfs", routes: ["6"], walkMinutes: 0 },
];
const REFRESH_SECONDS = 20;
const ALERTS_REFRESH_SECONDS = 120;
const OFFLINE_SECONDS = 90;
const RELOAD_HOURS = 6;
const TICKER_DOTS_PER_SECOND = 24;

const FEED_BASE_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/";
const ALERTS_URL = `${FEED_BASE_URL}camsys%2Fsubway-alerts.json`;

/********************* Display *********************/

// the sign is a grid of dots, as big as fits two lines each way and at least 150 dots across
const MIN_COLUMNS = 150;
const LINES_PER_DIRECTION = 2;
const HEADER_HEIGHT = 11;
const ROW_HEIGHT = 14;
const TICKER_HEIGHT = 14;
const TIMES_GAP = 6;
const DIRECTIONS = [
    { id: "N", label: "UPTOWN" },
    { id: "S", label: "DOWNTOWN" },
];
const MIN_ROWS = DIRECTIONS.length * (HEADER_HEIGHT + LINES_PER_DIRECTION * ROW_HEIGHT) + TICKER_HEIGHT;
const FRAME_MS = 33;

const COLORS = {
    black: "#000000",
    unlit: "#1e1408",
    amber: "#ffa31a",
    dimAmber: "#a8650c",
    rule: "#4d4d4d",
    red: "#ff3b30",
    white: "#ffffff",
    orange: "#ff6319",
    green: "#00933c",
    grey: "#808183",
};
const ROUTE_COLORS = { F: COLORS.orange, M: COLORS.orange, 6: COLORS.green };

// route bullets, 13 dots across
const BULLET_SIZE = 13;
const BULLET_CELLS = Array.from({ length: BULLET_SIZE * BULLET_SIZE }, (_, index) => [index % BULLET_SIZE - 6, Math.floor(index / BULLET_SIZE) - 6]);
const CIRCLE_DOTS = BULLET_CELLS.filter(([x, y]) => x * x + y * y <= 42);
const DIAMOND_DOTS = BULLET_CELLS.filter(([x, y]) => Math.abs(x) + Math.abs(y) <= 6);

// x11 misc-fixed 6x10 (public domain), each glyph is 10 rows of 6 bits, leftmost dot is 0x20
const FONT_COLUMNS = [0, 1, 2, 3, 4, 5];
const FONT = {
    " ": "00000000000000000000",
    "!": "00080808080800080000",
    "\"": "00141414000000000000",
    "#": "0014143e143e14140000",
    "$": "00081c281c0a1c080000",
    "%": "00122a1408142a240000",
    "&": "00102828102a241a0000",
    "'": "00080808000000000000",
    "(": "00040810101008040000",
    ")": "00100804040408100000",
    "*": "000022143e1422000000",
    "+": "000008083e0808000000",
    ",": "0000000000000c081000",
    "-": "000000003e0000000000",
    ".": "000000000000081c0800",
    "/": "00020204081020200000",
    "0": "00081422222214080000",
    "1": "000818280808083e0000",
    "2": "001c22020c10203e0000",
    "3": "003e02040c02221c0000",
    "4": "00040c14243e04040000",
    "5": "003e202c3202221c0000",
    "6": "000c10202c32221c0000",
    "7": "003e0204040810100000",
    "8": "001c22221c22221c0000",
    "9": "001c22261a0204180000",
    ":": "0000081c0800081c0800",
    ";": "0000081c08000c081000",
    "<": "00020408100804020000",
    "=": "0000003e003e00000000",
    ">": "00100804020408100000",
    "?": "001c2204080800080000",
    "@": "001c22262a2c201c0000",
    "A": "00081422223e22220000",
    "B": "003c12121c12123c0000",
    "C": "001c22202020221c0000",
    "D": "003c12121212123c0000",
    "E": "003e20203c20203e0000",
    "F": "003e20203c2020200000",
    "G": "001c22202026221c0000",
    "H": "002222223e2222220000",
    "I": "001c08080808081c0000",
    "J": "000e0404040424180000",
    "K": "00222428302824220000",
    "L": "002020202020203e0000",
    "M": "002222362a2222220000",
    "N": "002222322a2622220000",
    "O": "001c22222222221c0000",
    "P": "003c22223c2020200000",
    "Q": "001c222222222a1c0200",
    "R": "003c22223c2824220000",
    "S": "001c22201c02221c0000",
    "T": "003e0808080808080000",
    "U": "002222222222221c0000",
    "V": "00222222141414080000",
    "W": "002222222a2a36220000",
    "X": "00222214081422220000",
    "Y": "00222214080808080000",
    "Z": "003e02040810203e0000",
    "[": "001c10101010101c0000",
    "\\": "00202010080402020000",
    "]": "001c04040404041c0000",
    "^": "00081422000000000000",
    "_": "00000000000000003e00",
    "`": "08040000000000000000",
    "a": "0000001c021e221e0000",
    "b": "0020202c3222322c0000",
    "c": "0000001c2220221c0000",
    "d": "0002021a2622261a0000",
    "e": "0000001c223e201c0000",
    "f": "000c12103c1010100000",
    "g": "0000001e22221e02221c",
    "h": "0020202c322222220000",
    "i": "000800180808081c0000",
    "j": "0002000602020212120c",
    "k": "00202022243824220000",
    "l": "001808080808081c0000",
    "m": "000000342a2a2a220000",
    "n": "0000002c322222220000",
    "o": "0000001c2222221c0000",
    "p": "0000002c3222322c2020",
    "q": "0000001a2622261a0202",
    "r": "0000002c322020200000",
    "s": "0000001c201c023c0000",
    "t": "0010103c1010120c0000",
    "u": "000000222222261a0000",
    "v": "00000022221414080000",
    "w": "00000022222a2a140000",
    "x": "00000022140814220000",
    "y": "0000002222261a02221c",
    "z": "0000003e0408103e0000",
    "{": "00060804180408060000",
    "|": "00080808080808080000",
    "}": "00180408060804180000",
    "~": "00122a24000000000000",
};

// names of every stop the F, M and 6 serve, from the mta static gtfs
const STOP_NAMES = {
    "601": "Pelham Bay Park",
    "602": "Buhre Av",
    "603": "Middletown Rd",
    "604": "Westchester Sq-E Tremont Av",
    "606": "Zerega Av",
    "607": "Castle Hill Av",
    "608": "Parkchester",
    "609": "St Lawrence Av",
    "610": "Morrison Av-Soundview",
    "611": "Elder Av",
    "612": "Whitlock Av",
    "613": "Hunts Point Av",
    "614": "Longwood Av",
    "615": "E 149 St",
    "616": "E 143 St-St Mary's St",
    "617": "Cypress Av",
    "618": "Brook Av",
    "619": "3 Av-138 St",
    "621": "125 St",
    "622": "116 St",
    "623": "110 St",
    "624": "103 St",
    "625": "96 St",
    "626": "86 St",
    "627": "77 St",
    "628": "68 St-Hunter College",
    "629": "59 St",
    "630": "51 St",
    "631": "Grand Central-42 St",
    "632": "33 St",
    "633": "28 St",
    "634": "23 St-Baruch College",
    "635": "14 St-Union Sq",
    "636": "Astor Pl",
    "637": "Bleecker St",
    "638": "Spring St",
    "639": "Canal St",
    "640": "Brooklyn Bridge-City Hall",
    "A41": "Jay St-MetroTech",
    "B04": "21 St-Queensbridge",
    "B06": "Roosevelt Island",
    "B08": "Lexington Av/63 St",
    "B10": "57 St",
    "D15": "47-50 Sts-Rockefeller Ctr",
    "D16": "42 St-Bryant Pk",
    "D17": "34 St-Herald Sq",
    "D18": "23 St",
    "D19": "14 St",
    "D20": "W 4 St-Wash Sq",
    "D21": "Broadway-Lafayette St",
    "D42": "W 8 St-NY Aquarium",
    "D43": "Coney Island-Stillwell Av",
    "F01": "Jamaica-179 St",
    "F02": "169 St",
    "F03": "Parsons Blvd",
    "F04": "Sutphin Blvd",
    "F05": "Briarwood",
    "F06": "Kew Gardens-Union Tpke",
    "F07": "75 Av",
    "F09": "Court Sq-23 St",
    "F11": "Lexington Av/53 St",
    "F12": "5 Av/53 St",
    "F14": "2 Av",
    "F15": "Delancey St-Essex St",
    "F16": "East Broadway",
    "F18": "York St",
    "F20": "Bergen St",
    "F21": "Carroll St",
    "F22": "Smith-9 Sts",
    "F23": "4 Av-9 St",
    "F24": "7 Av",
    "F25": "15 St-Prospect Park",
    "F26": "Fort Hamilton Pkwy",
    "F27": "Church Av",
    "F29": "Ditmas Av",
    "F30": "18 Av",
    "F31": "Avenue I",
    "F32": "Bay Pkwy",
    "F33": "Avenue N",
    "F34": "Avenue P",
    "F35": "Kings Hwy",
    "F36": "Avenue U",
    "F38": "Avenue X",
    "F39": "Neptune Av",
    "G08": "Forest Hills-71 Av",
    "G09": "67 Av",
    "G10": "63 Dr-Rego Park",
    "G11": "Woodhaven Blvd",
    "G12": "Grand Av-Newtown",
    "G13": "Elmhurst Av",
    "G14": "Jackson Hts-Roosevelt Av",
    "G15": "65 St",
    "G16": "Northern Blvd",
    "G18": "46 St",
    "G19": "Steinway St",
    "G20": "36 St",
    "G21": "Queens Plaza",
    "M01": "Middle Village-Metropolitan Av",
    "M04": "Fresh Pond Rd",
    "M05": "Forest Av",
    "M06": "Seneca Av",
    "M08": "Myrtle-Wyckoff Avs",
    "M09": "Knickerbocker Av",
    "M10": "Central Av",
    "M11": "Myrtle Av",
    "M12": "Flushing Av",
    "M13": "Lorimer St",
    "M14": "Hewes St",
    "M16": "Marcy Av",
    "M18": "Delancey St-Essex St",
};

const sign = document.getElementById("sign");
const context = sign.getContext("2d");
const unlitGrid = document.createElement("canvas");
const glyphs = {};

let arrivals = [];
let alerts = [];
let lastUpdate = 0;
let refreshFailed = false;
let signWidth = MIN_COLUMNS;
let signHeight = MIN_ROWS;
let dots = [];
let pitch = 0;
let lastFrame = 0;

/********************* Feed Decoder *********************/

// the feeds are gtfs-realtime protobuf, and we only read a handful of fields:
// entity 2, trip_update 3, trip 1, route_id 5, stop_time_update 2, stop_id 4, arrival 2, departure 3, time 2

// one varint, using multiplication so 64-bit times don't overflow bitwise math
function varint(bytes, position) {
    let result = 0;
    let multiplier = 1;
    let byte;
    do {
        byte = bytes[position.index];
        position.index += 1;
        result += (byte & 0x7f) * multiplier;
        multiplier *= 128;
    } while (byte & 0x80);
    return result;
}

// hand each field to the callback as a number, or a byte range for strings and nested messages
function readFields(bytes, range, callback) {
    const position = { index: range.start };
    while (position.index < range.end) {
        // split the tag into field number and wire type
        const tag = varint(bytes, position);
        const field = Math.floor(tag / 8);
        const wireType = tag % 8;

        // varint
        if (wireType === 0) {
            callback(field, varint(bytes, position));
        }

        // length-delimited
        else if (wireType === 2) {
            const length = varint(bytes, position);
            callback(field, { start: position.index, end: position.index + length });
            position.index += length;
        }

        // fixed 64 bit, never needed
        else if (wireType === 1) {
            position.index += 8;
        }

        // fixed 32 bit, never needed
        else if (wireType === 5) {
            position.index += 4;
        }

        // anything else means a corrupt feed
        else {
            throw new Error(`Unsupported protobuf wire type ${wireType}`);
        }
    }
}

// text of a string field
function fieldText(bytes, range) {
    return new TextDecoder().decode(bytes.subarray(range.start, range.end));
}

// time from a StopTimeEvent
function eventTime(bytes, range) {
    let time = 0;
    readFields(bytes, range, (field, value) => {
        if (field === 2) {
            time = value;
        }
    });
    return time;
}

// stop id and time from a StopTimeUpdate, preferring arrival over departure
function stopTime(bytes, range) {
    let stopID = "";
    let arrival = 0;
    let departure = 0;
    readFields(bytes, range, (field, value) => {
        if (field === 4) {
            stopID = fieldText(bytes, value);
        }
        if (field === 2) {
            arrival = eventTime(bytes, value);
        }
        if (field === 3) {
            departure = eventTime(bytes, value);
        }
    });
    return { stopID, time: arrival || departure };
}

// route and remaining stops from a TripUpdate
function tripUpdate(bytes, range) {
    const trip = { route: "", stops: [] };
    readFields(bytes, range, (field, value) => {
        // route id lives in the trip descriptor
        if (field === 1) {
            readFields(bytes, value, (descriptorField, descriptorValue) => {
                if (descriptorField === 5) {
                    trip.route = fieldText(bytes, descriptorValue);
                }
            });
        }

        // one remaining stop
        if (field === 2) {
            trip.stops.push(stopTime(bytes, value));
        }
    });
    return trip;
}

// every trip in a feed
function feedTrips(bytes) {
    const trips = [];
    readFields(bytes, { start: 0, end: bytes.length }, (field, entity) => {
        // skip the header
        if (field !== 2) {
            return;
        }

        // skip vehicle positions and alerts
        readFields(bytes, entity, (entityField, value) => {
            if (entityField !== 3) {
                return;
            }
            trips.push(tripUpdate(bytes, value));
        });
    });
    return trips;
}

/********************* Arrivals *********************/

// upcoming arrivals at one station
function upcomingArrivals(station, trips, now) {
    const cutoff = now + station.walkMinutes * 60;
    const stationArrivals = [];
    trips.forEach(trip => {
        // skip other routes, express runs ("6X") count as their route
        const route = trip.route.replace(/X$/, "");
        if (!station.routes.includes(route)) {
            return;
        }

        // skip trips that don't stop here
        const stop = trip.stops.find(stop => stop.stopID.slice(0, -1) === station.stopID);
        if (!stop) {
            return;
        }

        // skip trains we can't make, and trains sitting at their terminal
        const lastStop = trip.stops.at(-1);
        if (stop.time < cutoff || stop === lastStop) {
            return;
        }

        // name the train by its last stop, or its direction when that stop is off the line
        const direction = stop.stopID.slice(-1);
        let destination = STOP_NAMES[lastStop.stopID.slice(0, -1)];
        if (!destination) {
            destination = direction === "N" ? "Uptown" : "Downtown";
        }

        stationArrivals.push({ route: trip.route, stopID: station.stopID, direction, destination, time: stop.time });
    });
    return stationArrivals;
}

// download and decode one feed
async function liveTrips(feed) {
    const response = await fetch(`${FEED_BASE_URL}${encodeURIComponent(feed)}`, { cache: "no-store" });

    // fetch only throws on network errors, so check the status too
    if (!response.ok) {
        throw new Error(`MTA feed ${feed} returned ${response.status}`);
    }

    return feedTrips(new Uint8Array(await response.arrayBuffer()));
}

/********************* Refresh *********************/

// download every feed and rebuild the arrivals, soonest first
async function refreshArrivals() {
    const feeds = [...new Set(STATIONS.map(station => station.feed))];
    try {
        // download the feeds together
        const tripsByFeed = await Promise.all(feeds.map(feed => liveTrips(feed)));

        // pick out every station's trains
        const now = Date.now() / 1000;
        arrivals = STATIONS
            .flatMap(station => upcomingArrivals(station, tripsByFeed[feeds.indexOf(station.feed)], now))
            .sort((a, b) => a.time - b.time);
        lastUpdate = Date.now();
        refreshFailed = false;
    } catch (error) {
        // keep the last good arrivals on the sign, their minutes keep counting down
        console.error(error);
        refreshFailed = true;
    }
}

// whether an alert's informed entity touches one of our stations: a station on one of its lines, or a line-wide alert with no stop
function affectsStations(item) {
    const route = item.route_id?.replace(/X$/, "");
    const stopID = item.stop_id?.replace(/[NS]$/, "");
    return STATIONS.some(station => {
        if (!station.routes.includes(route)) {
            return false;
        }
        return !stopID || stopID === station.stopID;
    });
}

// service alerts in effect right now at our stations
async function refreshAlerts() {
    try {
        const feed = await fetch(ALERTS_URL, { cache: "no-store" })
            .then(response => response.json());

        const now = Date.now() / 1000;
        const headlines = [];
        feed.entity.forEach(entity => {
            // only alerts that touch our stations
            const informed = entity.alert.informed_entity ?? [];
            if (!informed.some(affectsStations)) {
                return;
            }

            // only alerts in effect now
            const periods = entity.alert.active_period ?? [];
            if (!periods.some(period => period.start <= now && (!period.end || now <= period.end))) {
                return;
            }

            // english headline, with "[E][F]" as "E/F", line breaks as sentences, and plain ascii punctuation
            const translations = entity.alert.header_text?.translation ?? [];
            const headline = (translations.find(translation => translation.language === "en")?.text ?? "")
                .replace(/\]\[/g, "/")
                .replace(/\[([\w/]+)\]/g, "$1")
                .replace(/\s*\n+\s*/g, ". ")
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201c\u201d]/g, "\"")
                .replace(/[\u2013\u2014]/g, "-");

            // skip blanks and repeats
            if (!headline || headlines.includes(headline)) {
                return;
            }
            headlines.push(headline);
        });
        alerts = headlines;
    } catch (error) {
        // alerts are extra, keep the last ones
        console.error(error);
    }
}

/********************* Dots *********************/

// light one dot, ignoring anything outside the sign or the clip
function setDot(x, y, color, clipLeft = 0, clipRight = signWidth) {
    if (x < clipLeft || x >= clipRight || y < 0 || y >= signHeight) {
        return;
    }
    dots[y * signWidth + x] = color;
}

// a glyph's lit dots, trimmed so the font is proportional, cached for the frame loop
function glyph(character) {
    if (glyphs[character]) {
        return glyphs[character];
    }

    // unknown characters draw as a space
    const rows = (FONT[character] ?? FONT[" "]).match(/../g).map(pair => parseInt(pair, 16));

    // collect lit dots
    const pixels = [];
    rows.forEach((row, y) => {
        FONT_COLUMNS.forEach(x => {
            if (row & (0x20 >> x)) {
                pixels.push([x, y]);
            }
        });
    });

    // trim empty columns, spaces stay 3 dots wide
    let left = 0;
    let width = 3;
    if (pixels.length) {
        left = Math.min(...pixels.map(([x]) => x));
        width = Math.max(...pixels.map(([x]) => x)) - left + 1;
    }

    glyphs[character] = { pixels, left, width };
    return glyphs[character];
}

// width of a string in dots, with one dot between letters
function textWidth(text) {
    return [...text].reduce((total, character) => total + glyph(character).width + 1, 0) - 1;
}

// drop whole words, then letters, until the text fits
function fittedText(text, room) {
    let fitted = text;
    while (fitted.includes(" ") && textWidth(fitted) > room) {
        fitted = fitted.slice(0, fitted.lastIndexOf(" "));
    }
    while (fitted && textWidth(fitted) > room) {
        fitted = fitted.slice(0, -1);
    }
    return fitted.trim();
}

// write text with its top-left at x, y
function drawText(text, x, y, color, clipLeft = 0, clipRight = signWidth) {
    let cursor = x;
    [...text].forEach(character => {
        const { pixels, left, width } = glyph(character);

        // skip letters that are fully clipped, which is most of a long ticker
        if (cursor + width > clipLeft && cursor < clipRight) {
            pixels.forEach(([pixelX, pixelY]) => setDot(cursor + pixelX - left, y + pixelY, color, clipLeft, clipRight));
        }

        cursor += width + 1;
    });
}

/********************* Render *********************/

// trains grouped by key, in order of each group's next train
function groupedTrains(trains, key) {
    const groups = new Map();
    trains.forEach(train => {
        const groupKey = key(train);
        if (!groups.has(groupKey)) {
            groups.set(groupKey, []);
        }
        groups.get(groupKey).push(train);
    });
    return [...groups.values()];
}

// one line: bullet, where its next train is going, and its next two times
function drawTrainRow(trains, y, now) {
    const [next] = trains;

    // bullet, a diamond for express runs
    const route = next.route.replace(/X$/, "");
    const color = ROUTE_COLORS[route] ?? COLORS.grey;
    const shape = route === next.route ? CIRCLE_DOTS : DIAMOND_DOTS;
    shape.forEach(([x, dotY]) => setDot(7 + x, y + 6 + dotY, color));
    drawText(route, 7 - Math.floor((textWidth(route) - 1) / 2), y + 2, COLORS.white);

    // next two times as "2min  17min", or "Now" when it's in the station
    const [nextLabel, laterLabel] = trains.slice(0, 2).map(train => {
        const minutes = Math.max(0, Math.floor((train.time - now) / 60));
        return minutes === 0 ? "Now" : `${minutes}min`;
    });

    // the train after, dimmer, at the right edge
    let nextRight = signWidth - 1;
    if (laterLabel) {
        const laterX = signWidth - 1 - textWidth(laterLabel);
        drawText(laterLabel, laterX, y + 2, COLORS.dimAmber);
        nextRight = laterX - TIMES_GAP;
    }

    // the next train, bright, blinking while it's in the station
    const nextX = nextRight - textWidth(nextLabel);
    if (nextLabel !== "Now" || Math.floor(Date.now() / 500) % 2 === 0) {
        drawText(nextLabel, nextX, y + 2, COLORS.amber);
    }

    // destination before the dash ("Coney Island"), cut to the room left
    const destination = fittedText(next.destination.split("-")[0], nextX - 22);
    drawText(destination, 17, y + 2, COLORS.amber);
}

// an uptown section over a downtown one, each labeled, with a row per line showing its next two trains
function drawTrains(now) {
    const upcoming = arrivals.filter(arrival => arrival.time > now - 30);

    // split the space above the ticker evenly between the directions
    const sectionHeight = Math.floor((signHeight - TICKER_HEIGHT) / DIRECTIONS.length);
    const sectionRows = Math.max(1, Math.floor((sectionHeight - HEADER_HEIGHT) / ROW_HEIGHT));
    const slot = (sectionHeight - HEADER_HEIGHT) / sectionRows;

    DIRECTIONS.forEach((direction, index) => {
        const top = index * sectionHeight;
        const rowY = row => top + HEADER_HEIGHT + Math.floor(row * slot + (slot - ROW_HEIGHT) / 2);

        // thin rule between sections, so each label stays attached to its own trains
        if (index > 0) {
            Array.from({ length: signWidth }).forEach((_, x) => setDot(x, top, COLORS.rule));
        }

        // label
        drawText(direction.label, 1, top + 2, COLORS.white);

        // nothing to show yet
        const trains = upcoming.filter(arrival => arrival.direction === direction.id);
        if (!trains.length) {
            let message = "Loading trains...";
            if (lastUpdate) {
                message = "No trains scheduled";
            }
            drawText(message, 17, rowY(0) + 2, COLORS.amber);
            return;
        }

        // a row per line, or per station when there are more lines than rows, since the F and M share a platform
        let rows = groupedTrains(trains, train => train.route.replace(/X$/, ""));
        if (rows.length > sectionRows) {
            rows = groupedTrains(trains, train => train.stopID);
        }

        rows.slice(0, sectionRows).forEach((rowTrains, row) => drawTrainRow(rowTrains, rowY(row), now));
    });
}

// bottom line: the clock, then alerts or an offline warning scrolling past
function drawTicker(time) {
    // thin rule between the trains and the ticker
    const ruleY = signHeight - TICKER_HEIGHT;
    Array.from({ length: signWidth }).forEach((_, x) => setDot(x, ruleY, COLORS.rule));

    // clock, with browsers' narrow space before AM/PM swapped for a plain one the font has
    const tickerY = ruleY + 2;
    const clock = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(/\s/g, " ");
    drawText(clock, 1, tickerY, COLORS.amber);

    // offline warning beats alerts
    const sinceUpdate = Date.now() - lastUpdate;
    const offline = (lastUpdate && sinceUpdate > OFFLINE_SECONDS * 1000) || (!lastUpdate && refreshFailed);
    let message = alerts.join("     ");
    let color = COLORS.amber;
    if (offline) {
        message = "Can't reach the MTA. Please check the Wi-Fi connection.";
        color = COLORS.red;
    }

    // nothing to scroll
    if (!message) {
        return;
    }

    // scroll through the space right of the clock, looping
    const left = textWidth(clock) + 6;
    const right = signWidth - 1;
    const span = textWidth(message) + right - left;
    const offset = Math.floor(time / 1000 * TICKER_DOTS_PER_SECOND) % span;
    drawText(message, right - offset, tickerY, color, left, right);
}

// paint the lit dots over the unlit grid
function paintDots() {
    context.drawImage(unlitGrid, 0, 0);
    dots.forEach((color, index) => {
        if (!color) {
            return;
        }

        // soft glow, then the dot
        const centerX = (index % signWidth + 0.5) * pitch;
        const centerY = (Math.floor(index / signWidth) + 0.5) * pitch;
        context.fillStyle = color;
        context.globalAlpha = 0.22;
        context.beginPath();
        context.arc(centerX, centerY, pitch * 0.62, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
        context.beginPath();
        context.arc(centerX, centerY, pitch * 0.4, 0, Math.PI * 2);
        context.fill();
    });
}

// build and paint one frame, capped near 30 fps
function renderFrame(time) {
    requestAnimationFrame(renderFrame);
    if (time - lastFrame < FRAME_MS) {
        return;
    }
    lastFrame = time;

    // start dark
    dots.fill(null);

    // content
    drawTrains(Date.now() / 1000);
    drawTicker(time);
    paintDots();
}

// fill the screen: the biggest dots that still fit the minimum grid, then as many columns and rows as fit, and draw the unlit grid once
function resizeSign() {
    const ratio = window.devicePixelRatio;
    pitch = Math.max(2, Math.floor(Math.min(sign.clientWidth * ratio / MIN_COLUMNS, sign.clientHeight * ratio / MIN_ROWS)));
    signWidth = Math.floor(sign.clientWidth * ratio / pitch);
    signHeight = Math.floor(sign.clientHeight * ratio / pitch);
    dots = new Array(signWidth * signHeight).fill(null);
    sign.width = signWidth * pitch;
    sign.height = signHeight * pitch;
    unlitGrid.width = sign.width;
    unlitGrid.height = sign.height;

    // background
    const unlitContext = unlitGrid.getContext("2d");
    unlitContext.fillStyle = COLORS.black;
    unlitContext.fillRect(0, 0, unlitGrid.width, unlitGrid.height);

    // every dot, dark
    unlitContext.fillStyle = COLORS.unlit;
    dots.forEach((_, index) => {
        unlitContext.beginPath();
        unlitContext.arc((index % signWidth + 0.5) * pitch, (Math.floor(index / signWidth) + 0.5) * pitch, pitch * 0.4, 0, Math.PI * 2);
        unlitContext.fill();
    });
}

/********************* Setup *********************/

// draw the sign, load trains and alerts, then keep them current
async function setup() {
    // size now, then whenever the sign's box changes, which on ios settles after the resize event when rotating
    resizeSign();
    new ResizeObserver(() => resizeSign()).observe(sign);
    requestAnimationFrame(renderFrame);

    // first load
    await Promise.all([refreshArrivals(), refreshAlerts()]);

    // keep current
    setInterval(refreshArrivals, REFRESH_SECONDS * 1000);
    setInterval(refreshAlerts, ALERTS_REFRESH_SECONDS * 1000);

    // reload a few times a day so a page left open for weeks starts fresh
    setTimeout(() => window.location.reload(), RELOAD_HOURS * 60 * 60 * 1000);
}

setup();
