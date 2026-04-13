# Task Frontend

A minimal, fast React application for browsing, searching, and filtering property listings. Designed to be standalone or embedded in WordPress plugins.



## Project Structure

```
react-app/
├── src/
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Global styles
│   ├── main.jsx                # React entry point
│   ├── services/
│   │   └── api.js              # API request functions
│   ├── components/
│   │   ├── FiltersPanel.jsx    # Filter controls
│   │   ├── ListingsTable.jsx   # Results table
│   │   └── Pagination.jsx      # Pagination controls
│   └── utils/
│       └── format.js           # Utility functions
├── public/
│   └── favicon.svg             # Favicon
├── build/                      # Production bundle (generated)
├── index.html                  # HTML entry point
├── vite.config.js              # Build configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## Features

- **Sortable Table** - Click headers to sort by title, location, price, or date
- **Advanced Filtering** - Filter by price range, location, date range, and search terms
- **Pagination** - Smart pagination showing current page context
- **Real-time Search** - Search across titles and locations instantly
- **Metadata Display** - Shows scraping stats, last update time, and error logs
- **Update Trigger** - Button to manually trigger property listing scraping
- **Responsive Design** - Works on desktop and mobile devices
- **Zero External Dependencies** - Only React and React DOM (no CSS framework bloat)

## Requirements

- **Node.js** 16.x or higher
- **npm** 7.x or higher
- **Backend API** running on `http://localhost:3000/api` (or configurable)

## Tech Stack

- **React** 19.2.4 - UI framework
- **Vite** 8.0.4 - Build tool & dev server
- **ESLint** 9.39.4 - Code linting
- **Vanilla CSS** - No CSS framework (minimal, semantic styling)

## Installation

```bash
# Navigate to project directory
cd react-app

# Install dependencies
npm install
```

## Development

```bash
# Start dev server (runs on http://localhost:5173)
npm run dev

# Open browser to http://localhost:5173
```

The app will automatically reload when you make changes.

## Building for Production

```bash
# Build optimized bundle
npm run build

# Output goes to ./build/ directory
```

This creates minified, production-ready files ready for deployment.

## WordPress Plugin Integration

### Add React App to Plugin

Copy the files to your WordPress plugin:

```
/wp-content/plugins/your-plugin/
├── build/          (compiled React app)
├── plugin.php      (WordPress plugin file)
└── README.md
```

### Plugin Setup Example

```php
<?php
// plugin.php
function enqueue_react_app($hook) {
    if ($hook !== 'toplevel_page_hidden-deals') return;
    
    wp_enqueue_script(
        'my-react-app',
        plugins_url('/build/assets/index-HASH.js', __FILE__)
    );
    wp_enqueue_style(
        'my-react-app-css',
        plugins_url('/build/assets/index-HASH.css', __FILE__)
    );
    
    // Set API URL for React app
    wp_localize_script('my-react-app', 'LISTINGS_CONFIG', array(
        'apiUrl' => 'http://localhost:3000/api'
    ));
}

add_action('admin_enqueue_scripts', 'enqueue_react_app');
```

## 🔗 API Configuration

### Environment Setup

The app reads the API base URL from `window.LISTINGS_API_URL`. Set it before the React app loads:

**For Development (index.html):**
```html
<script>
  window.LISTINGS_API_URL = 'http://localhost:3000/api';
</script>
```

**For WordPress:**
```php
<script>
  window.LISTINGS_API_URL = '<?php echo esc_js(get_option('listings_api_url', 'http://localhost:3000/api')); ?>';
</script>
```

### Required API Endpoints

The backend must provide these three endpoints:

#### 1. `GET /api/meta`
Returns metadata for filtering options.

Response:
```json
{
    "listings": {
        "min_price": 1,
        "max_price": 4750000,
        "last_updated": "2026-04-12T20:59:31.732808+00:00",
        "scraping_duration": 0.0115,
        "total_properties": 5582,
        "logs": {
            "error_logs": [],
            "scraping_summary": "Scraped 5582 properties"
        },
        "locations": ["SK23", "LS19", "W13", "S1", "PL9"]
    }
}
```

#### 2. `GET /api/listings`
Returns paginated and filtered listings.

Query Parameters:
- `minprice` - Minimum price filter
- `maxprice` - Maximum price filter
- `startdate` - Filter by start date (YYYY-MM-DD)
- `enddate` - Filter by end date (YYYY-MM-DD)
- `location` - Filter by location code
- `search` - Search term for title/location
- `per_page` - Items per page (default: 10)
- `pg` - Page number (default: 1)

Response:
```json
{
    "total": 5,
    "per_page": 10,
    "pg": 1,
    "total_pages": 1,
    "show_pagination": false,
    "listings": [
        {
            "title": "4 bedroom terraced house for sale",
            "price": 375000,
            "date": "2025-12-18",
            "location": "BN11",
            "link": "https://example.com/properties/123456"
        }
    ]
}
```

#### 3. `POST /api/scrape`
Triggers property listing scrape.

Response: `{ "status": "success" }` or error

### CORS Configuration

The backend must allow requests from the frontend origin:

```javascript
// Express.js example
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost', 'https://yourdomain.com'],
    credentials: true
}));
```

##  Code Quality

```bash
# Run ESLint
npm run lint

# Preview production build locally
npm run preview
```

##  Environment Variables

No `.env` file required. Configuration is done via:
- `window.LISTINGS_API_URL` - API base URL
- WordPress `wp_localize_script()` - For plugin integration

##  Troubleshooting

### CORS Errors
**Problem:** "Access to fetch blocked by CORS policy"

**Solution:** Configure backend CORS to allow your frontend origin:
```php
// WordPress headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### 404 on localhost:5173
**Problem:** App not found when accessing `http://localhost:5173`

**Solution:** Make sure dev server is running:
```bash
npm run dev
```

### API Connection Refused
**Problem:** `net::ERR_CONNECTION_REFUSED` on API calls

**Solution:** Verify backend API is running on port 3000 and CORS is configured.

