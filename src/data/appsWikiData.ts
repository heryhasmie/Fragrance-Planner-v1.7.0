export const appsWikiData = [
  {
    id: "formula-list",
    title: "Formula List",
    content: "### Formula Creation\n- **Formula Capacity**\n- **Auto-count** active material / oil percentage\n- **Auto-count** alcohol to total 100%\n- Add single fragrance oil OR hybrid fragrance oil (multiple)\n- Add material (fixative or custom) with % (supports multiple entries)\n- Add solvents (DPG / IPM / DEP / Alcohol) -> Auto-fill remaining % to reach 100%\n- **Version Notes (R&D):** Track differences between formula versions\n- Optional Formula Capacity\n\n### Accord Creation\n- Define accord size (track if composition is complete)\n- Insert pre-made accords into new formulas\n- Add multiple raw materials / solvents\n- Units supported: g / ml / % / drops / mg\n- **Version Notes (R&D):** Track differences between accord versions\n\n### Experimental Features\n- Import existing formulas (Excel or text format)\n- Helps speed up formula entry from external sources\n\n### Formula Comparison\n- Compare Formula vs Formula\n- Compare Accord vs Accord\n- **Identify:** Composition differences, Percentage changes, Material variations"
  },
  {
    id: "fragrance-db",
    title: "Fragrance DB",
    content: "### Core Function\nCreate and manage custom fragrance entries. Define fragrance identity, structure, and classification.\n\n### Fragrance Creation\n- Fragrance Name & House Name\n- Original Scent (Inspiration Reference)\n- Smell Profile & Maceration Period (Linked to Maceration Tracker)\n- Perfume Gender Preference & Perfume Type\n- **Perfume Notes:** Top Notes, Heart Notes, Base Notes\n- Tagging System & Fragrance Description\n\n### Visual Card System\n- Each fragrance is saved as a visual card\n- 90+ factory color combinations available\n- User can set custom card color to match visual identity\n- Card View displays full fragrance details, styled with selected color theme\n\n### List View Mode\n- Alternative compact viewing mode\n- Icons and font styling adapt to fragrance theme\n- **Sorting Options:** By House, By Perfume Type, By Gender Preference\n- **Search Function:** Quickly find fragrances"
  },
  {
    id: "material-list",
    title: "Material List",
    content: "### Core Function\nManage and organize all materials used in formulations. Central database for raw materials, solvents, and accords.\n\n### Material Creation\n- Material Name & CAS Number\n- Description\n- Olfactory Family & Sub-Family\n- **Material Type:** Raw Material, Solvent, Accord Material, Natural Oil, Oil, Labdanum, Labdanum Absolute, Absolute, Resinoid\n- Secondary Material Type (Optional additional classification)\n- Material Character (Top Note, Heart Note, Base Note)\n- **Dilution Settings:** Set if diluted, define dilution percentage and solvent used\n\n### Import Material List\n- Import materials using Excel file to speed up initial setup\n- 500+ already made material list can be found in Reddit Community\n\n### Organization & Management\n- Group materials by Material Type\n- Search functionality for quick access\n- Sorting options for structured navigation"
  },
  {
    id: "equipment",
    title: "Equipment & Application",
    content: "### Core Function\nTrack owned equipment and applications to maintain a clear inventory of available tools and resources.\n\n### Item Creation\n- Name (Equipment or Application)\n- **Type:** Equipment or Application\n- Size / Capacity\n- Description\n\n### Management\n- View all owned items in a structured list\n- Keep track of available tools for formulation workflow\n- Search function to quickly find equipment or applications"
  },
  {
    id: "blend-calculator",
    title: "Blend Calculator",
    content: "### Core Function\nQuickly calculate required materials and quantities for a blend. Convert formula percentages into actual measurable values.\n\n### Calculation Flow\n- Select Formula\n- Select Fragrance (Optional)\n- Set Total Capacity (ml / g)\n- **System Output:** Required Materials, Oil Composition, Percentage Breakdown, Required Quantity (ml / g)\n\n### Calculation Output\n- Displays full material list based on selected formula\n- Converts % into exact measurable amounts\n- Ensures accurate scaling based on chosen capacity\n\n### History\n- Save calculated blends and access previous calculations anytime\n- Reuse or review past blend setups"
  },
  {
    id: "dilution-wizard",
    title: "Dilution Wizard",
    content: "### Core Function\nGuide users to accurately dilute materials to a target concentration. Simplifies dilution calculations for real-world preparation.\n\n### Workflow\n- Select Material to Dilute\n- Select Solvent (DPG / IPM / DEP / Alcohol)\n- Set Target Dilution Percentage\n- **Input Mode:** Set Total Target Volume/Weight OR Set Available Material Amount\n\n### Calculation Output\n- Displays: Required Material Amount, Required Solvent Amount, Final Total Quantity, Final Concentration (%)\n- Ensures accurate proportion between material and solvent\n\n### Visual Output\n- Clean and clear UI presentation of dilution breakdown\n- Easy-to-read values for real-world mixing\n\n### History\n- Save calculated dilutions\n- Access and reuse previous dilution setups"
  },
  {
    id: "blend-planner",
    title: "Blend Planner",
    content: "### Core Function\nPlan and manage blend batches or bulk production. Calculate required materials and prepare for execution.\n\n### Plan Creation\n- Set Plan Name & Date\n- **Add Entries:** Select Fragrance, Select Formula, Set Total Capacity (ml / L)\n- Multiple entries allowed. Same fragrance/formula can be repeated with different capacities.\n\n### Material Preview\n- **Per Entry:** Materials used, required quantity per material\n- **Master Content:** Total combined materials required, aggregated quantity\n- **View Settings:** Unit toggle (ml or L), Decimal precision control\n\n### Plan Overview\n- Displays all entries and total combined material requirement\n\n### Special Features\n- **Take Materials:** Deduct required materials from Inventory Manager\n- **Commit to Inventory:** Create new item in Inventory Manager (Type: Blended Oil)\n- **Budget Integration:** Import plan into Budget Planner to auto-calculate cost\n\n### Plan Management\n- Create multiple plans, edit names, duplicate existing plans"
  },
  {
    id: "maceration-tracker",
    title: "Maceration Tracker",
    content: "### Core Function\nTrack maceration progress for fragrances or blend batches. Monitor readiness and key milestones over time.\n\n### Tracking Setup\n- **Select Source:** Fragrance or Batch\n- Set Start Date & Maceration Period (user-defined duration)\n\n### Tracking Output\n- **Remaining Days:** Shows how many days left\n- **Progress:** Displays maceration progress in percentage (%)\n- **Ready Date:** Automatically calculated\n- **Milestones:** 2 Week Checkpoint, 4 Week Checkpoint (markable checkboxes)\n\n### Batch Details\n- Displays Formula Used, Material Composition, Total Capacity\n\n### User Interface\n- Clean and easy-to-understand layout with clear visualization of time and readiness"
  },
  {
    id: "price-tracker",
    title: "Price Tracker",
    content: "### Core Function\nTrack and compare prices across suppliers. Support multiple pricing models and currencies.\n\n### Price Entry Creation\n- Supplier Name, Item Type (Raw Material, Equipment, Application, Fragrance Oil), Item Name\n- **Pricing Model:** Unit-Based or Capacity-Based\n- Quantity (ml / g / kg / L / oz / unit)\n\n### Multi-Currency Support\n- Set 2 prices in different currencies\n- Manual conversion input (offline system)\n- Real-time conversion based on user-defined rate\n\n### Supplier Details\n- Location (Country / Region), Platform (Alibaba, Facebook, Others), Notes\n\n### Organization\n- Group by Item Type, Platform, Supplier\n- Search and filter capabilities\n\n### Price Variation System\n- Same item + different supplier = variation entry\n- Enables direct price comparison across sources"
  },
  {
    id: "budget-planner",
    title: "Budget Planner",
    content: "### Core Function\nPlan and estimate total cost for materials, tools, and production. Consolidate pricing, quantities, and logistics into one budget view.\n\n### Budget Plan Creation\n- Create multiple budget plans\n- Add items by category: Raw Material, Fragrance Oil, Equipment, Application\n- Auto-sum total cost per category\n\n### Item Configuration\n- Select Supplier, Set Quantity\n- Auto-fetch price from selected supplier\n- **Discount:** Optional discount per item\n\n### Shipping Configuration\n- Add custom shipment entries (Shipment Name, Price)\n- **Rate Type:** Flat Fee, Per kg, Per Item, Per Liter\n\n### Cost Output\n- Detailed cost breakdown: Item cost, Discount adjustments, Shipping cost\n- Total Cost (Final aggregated budget)\n\n### Special Feature (Blend Import)\n- Quick import from Blend Planner (auto-fills materials, quantities, links pricing)\n\n### Management\n- View and manage multiple budget plans with a structured financial overview"
  },
  {
    id: "inventory",
    title: "Inventory Manager",
    content: "### Core Function\nTrack and manage all inventory items used in the workflow. Monitor stock levels and usage history.\n\n### Item Creation\n- Item Name\n- **Item Type:** Raw Material, Equipment / Bottle, Fragrance Oil, Bulk Fragrance, Finished Fragrance, Blended Oil\n- Container Capacity & Initial Stock Level\n- Container Label\n\n### Item Handling Logic\n- Same item name and type can exist multiple times (treated as separate containers)\n\n### Inventory Tracking\n- Stock Reduction History (how quantity is reduced over time)\n- Activity Tracking: Usage from system actions or manual deductions\n- Each entry maintains its own history log\n\n### List View & Filtering\n- View all inventory items in structured list\n- Filter by Item Type, clear visibility of stock levels"
  },
  {
    id: "bottling-planner",
    title: "Bottling Planner",
    content: "### Core Function\nPlan and execute bottling from blended oil. Calculate production, cost, and profit before updating inventory.\n\n### Bottling Plan Creation\n- **Step 1:** Select Blended Oil from Inventory Manager\n- **Step 2:** Configure Bottling (Select Fragrance, Bottle, Capacity, Quantity, Selling Price, Other Costs)\n\n### Production Logic\n- User can create multiple bottling entries from same blended oil\n- Total blended oil used and remaining oil tracked\n- **Transfer Loss Factor:** User-defined loss percentage\n\n### Cost Intelligence (ROI System)\n- Displays Formula Cost, Bottle Packaging Cost, Total Cost per Bottle, Batch Size\n- Estimated Total Revenue and Estimated Net Profit\n\n### Final Output\n- Total Production Cost, Total Revenue, Estimated Net Profit\n\n### Inventory Integration\n- Create new item (Finished Fragrance Bottled)\n- Deduct blended oil and bottles from Inventory Manager\n\n### Session Management\n- Support multiple bottling plans tracked independently"
  },
  {
    id: "agent-contact",
    title: "Agent & Contact",
    content: "### Core Function\nManage agents and customer data for offline POS workflow. Enable structured sales tracking linked to agents and customers.\n\n### Agent Management\n- Create Agent Profile (Name, Phone, Bank, Gender, Location, Notes, Commission %)\n- Linked sales history per agent\n- **Agent Export:** Export Agent ID (.aid file) for \"Fragrance Planner for Agent\" app\n\n### Customer Management\n- Create Customer Profile (Name, Gender, Style Preference, Phone, Email, Location, Bank, Notes)\n- Track purchase history per customer\n\n### Data Management\n- Support multiple agents and customers in structured list view\n- Designed for offline usage"
  },
  {
    id: "sell-tracker",
    title: "Sell Tracker",
    content: "### Core Structure\nTwo main sections: Item Shop and Sell Records.\n\n### Item Shop\n- Add Item from Inventory Manager (Finished Fragrance Bottled only)\n- Set Selling Name, Selling Price\n- Auto-filled capacity based on inventory\n- System detects available stock and updates in real-time\n\n### Sell Records\n- Create Entry: Add new sales record\n- **Customer & Order Info:** Customer, Order Date, Selling Agent, Commission %, Order Status (Pending/Completed/Cancelled)\n- **Payment & Adjustments:** Payment Method, Discount, Postage Fee\n- **Item Selection:** Add purchased items from Item Shop\n- **Receipt:** Generate receipt view and export to PDF\n\n### Revenue Report\n- Displays Gross Total, Total Discount, Total Commission, Net Sales Revenue\n\n### Import Feature\n- Import Fragrance Planner Sales (FGS) records created by agents\n\n### Inventory Integration\n- Real-time stock deduction automatically syncs with Inventory Manager"
  },
  {
    id: "notebooks",
    title: "Notebooks",
    content: "### Core Function\nDigital workspace for notes, ideas, and formulation planning. Supports structured and freeform content.\n\n### Notebook Management\n- Create multiple notebooks\n- Each notebook can contain multiple pages\n- **Page Types:** Blank, Lined, Grid\n\n### Page Content\n- **Text Box:** Add and edit text freely with custom color support\n- **Dropdown References:** Insert data from Material List, Formula, Fragrance, Inventory, Equipment\n- **Sketch Tool:** Freehand drawing with custom color\n\n### Customization\n- Set colors for text boxes and sketch drawings\n- Everything selectable can be duplicated, deleted, or grouped"
  },
  {
    id: "feedback",
    title: "Feedback",
    content: "### Core Function\nCollect performance feedback for each fragrance. Track real user experience and scent behavior over time.\n\n### Feedback Entry\n- Name, Date, Gender, Contact\n- Spray Count, Longevity (hours), Sillage (hours), Projection (meters)\n- **Performance (Auto Calculated):** Weak / Average / Above Average / Beast\n- Time Wear, Scent Check Time, Comment\n\n### Purpose\n- Understand real-world performance\n- Compare fragrance behavior across users\n- Improve formulation and refinement decisions"
  },
  {
    id: "settings",
    title: "Settings / Global Features",
    content: "### Currency and Conversion\n- **Global Currency Symbol:** Symbol used across the app (RM, $, etc.)\n- **Base & Target Currency Name**\n- **Conversion Multiplier:** User-defined conversion rate for offline systems\n\n### UI Customization\n- **Theme Selection:** Light Red, Dark Red, Dark Gold, White Gold\n- **UI Scaling:** Adjust interface size for better readability\n\n### Data Export / Import\n- Export/Import Format: .fgp (Fragrance Planner File)\n- Options to export/import individual tab data or full system data"
  }
];
