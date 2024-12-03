import { faker } from "@faker-js/faker";

export const createTables = [
    `CREATE TABLE IF NOT EXISTS NCRForm (
        id INTEGER PRIMARY KEY,
        CreationDate datetime NOT NULL,
        LastModified datetime NOT NULL,
        FormStatus STRING NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS Role (
        id INTEGER PRIMARY KEY,
        Title STRING NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY,
        FName STRING NOT NULL,
        MName STRING,
        LName STRING NOT NULL,
        Email STRING NOT NULL UNIQUE,
        Password STRING NOT NULL,
        RoleID INTEGER NOT NULL,
        FOREIGN KEY(RoleID) REFERENCES Role(id)
    )`,
    `CREATE TABLE IF NOT EXISTS FormUsers (
        NCRForm_id INTEGER NOT NULL,
        User_id INTEGER NOT NULL,
        PRIMARY KEY (NCRForm_id, User_id),
        FOREIGN KEY (NCRForm_id) REFERENCES NCRForm(id),
        FOREIGN KEY (User_id) REFERENCES User(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Supplier (
        id INTEGER PRIMARY KEY,
        SupplierName STRING NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS Product (
        id INTEGER PRIMARY KEY,
        ProductName STRING NOT NULL,
        Number INTEGER NOT NULL UNIQUE,
        SupplierID INTEGER NOT NULL,
        FOREIGN KEY (SupplierID) REFERENCES Supplier(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Quality (
        NCRFormID INTEGER PRIMARY KEY,
        NCRNumber STRING NOT NULL,
        SalesOrder INTEGER NOT NULL,
        SRInspection BOOLEAN NOT NULL,
        WorkInProgress BOOLEAN NOT NULL,
        ItemDescription STRING NOT NULL,
        QuantityReceived INTEGER NOT NULL,
        QuantityDefective INTEGER NOT NULL,
        IsNonConforming BOOLEAN NOT NULL,
        Details STRING NOT NULL,
        QualityStatus STRING NOT NULL,
        LastModified DATETIME NOT NULL,
        ProductID INTEGER NOT NULL,
        FOREIGN KEY (NCRFormID) REFERENCES NCRForm(id),
        FOREIGN KEY (ProductID) REFERENCES Product(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Engineer (
        NCRFormID INTEGER PRIMARY KEY,
        Review STRING NOT NULL,
        NotifyCustomer BOOLEAN NOT NULL,
        Disposition STRING NOT NULL,
        RevisionNumber STRING,
        RevisionDate DATETIME,
        EngineerStatus STRING NOT NULL,
        LastModified DATETIME NOT NULL,
        FOREIGN KEY (NCRFormID) REFERENCES NCRForm(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Purchasing (
        NCRFormID INTEGER PRIMARY KEY,
        PreliminaryDecision STRING NOT NULL,
        CARRaised BOOLEAN NOT NULL,
        CARNumber INTEGER,
        FollowUpRequired BOOLEAN NOT NULL,
        FollowUpType STRING, 
        FollowUpDate DATETIME,
        PurchasingStatus STRING NOT NULL,
        LastModified DATETIME NOT NULL,
        FOREIGN KEY (NCRFormID) REFERENCES NCRForm(id)
    )`,
];

export const dropTables = [
    "DROP TABLE IF EXISTS FormUsers",
    "DROP TABLE IF EXISTS Quality",
    "DROP TABLE IF EXISTS Engineer",
    "DROP TABLE IF EXISTS Purchasing",
    "DROP TABLE IF EXISTS Product",
    "DROP TABLE IF EXISTS Supplier",
    "DROP TABLE IF EXISTS User",
    "DROP TABLE IF EXISTS Role",
    "DROP TABLE IF EXISTS NCRForm",
];

export const seedRoles = [
    `INSERT INTO Role (Title) VALUES 
        ('Admin'),
        ('Inspector'),
        ('Engineer'),
        ('Purchasing')`,
];

const productData = [
    "Ball Bearing", "Steel Pipe", "Hydraulic Pump", "Industrial Fan", "Electric Motor", 
    "Air Compressor", "Welding Machine", "Safety Gloves", "Conveyor Belt", "Pressure Gauge", 
    "Industrial Hose", "Circuit Breaker", "LED Work Light", "Lubricant Oil", "Gear Reducer", 
    "Pneumatic Cylinder", "Torque Wrench", "Safety Helmet", "Power Supply Unit", "Filter Cartridge", 
    "Welding Rod", "Sprocket Gear", "Industrial Valve", "Hand Tool Set", "Bearing Grease", 
    "Hydraulic Oil", "Protective Goggles", "V-Belt", "Control Panel", "Lifting Chain", 
    "Electric Drill", "Industrial Fasteners", "Pipe Fittings", "Steel Cable", "Work Boots", 
    "Cooling Fan", "Cutting Disc", "Battery Charger", "Industrial Adhesive", "Ball Valve", 
    "Wrench Set", "Gas Cylinder", "Rubber Gasket", "Air Filter", "Hose Clamps", 
    "Safety Mask", "Roller Chain", "Industrial Hammer", "Tool Box", "Grinder Disc", 
    "Angle Grinder", "Sealing Tape", "Pipe Wrench", "Hydraulic Jack", "Industrial Tape", 
    "Heat Gun", "Pallet Jack", "Electric Saw", "Pressure Washer", "Cutting Oil", 
    "Industrial Pulley", "Socket Set", "Machine Oil", "Safety Vest", "Handheld Radio", 
    "Grinding Wheel", "Plastic Container", "Welding Helmet", "Impact Drill", "Rubber Mat", 
    "PPE Kit", "Air Blower", "Locking Pliers", "Industrial Fan Belt", "Sandpaper Roll", 
    "Extension Cord", "Oil Filter", "Hydraulic Hose", "Tool Belt", "Lifting Strap", 
    "Hand Saw", "Safety Harness", "Cleaning Brush", "Industrial Cleaner", "Storage Bin", 
    "Metal File", "Work Light", "Grease Gun", "Tool Cart", "Chain Hoist", 
    "Hearing Protection", "Rubber Gloves", "Dust Mask", "Work Apron", "Utility Knife", 
    "Pallet Rack", "Wire Stripper", "Grease Fitting", "Metal Clamp", "Tool Organizer"
];

//const Roles = ['Admin', 'Inspector', 'Engineer', 'Purchasing'];

const NCRForms = [];
const QualityForms = [];
const EngineeringForms = [];
const PurchasingForms = [];

const Users = [];
const FormUsers = [];

const seedUsers = () => {
    Users.push({
        id: 1,
        FName: "Alan",
        MName: "W",
        LName: "Wake",
        Email: "admin@crossfire.ca",
        Password: "admin",
        RoleID: 1,
    });
    Users.push({
        id: 2,
        FName: "Reginald",
        MName: "",
        LName: "Windsor",
        Email: "quality@crossfire.ca",
        Password: "quality",
        RoleID: 2,
    });
    Users.push({
        id: 3,
        FName: "Dell",
        MName: "",
        LName: "Conagher",
        Email: "engineer@crossfire.ca",
        Password: "engineer",
        RoleID: 3,
    });
    Users.push({
        id: 4,
        FName: "Eorlund",
        MName: "",
        LName: "Gray-Mane",
        Email: "purchasing@crossfire.ca",
        Password: "purchasing",
        RoleID: 4,
    });
};

const seedSuppliers = () => {
    const Suppliers = [];
    const Products = [];
    let thisProductData = faker.helpers.shuffle(productData);

    let count = 0;
    for (let i = 0; i < 30; i++) {
        let name;
        do {
            name = faker.company.name();
        } while (name.includes(`'`) == true);
        Suppliers.push({
            id: i + 1,
            SupplierName: name,
        });

        for (let j = 0; j < 3; j++) {
            count++;
            let name = thisProductData.shift();
            let uniqueNumber;
            do {
                uniqueNumber = faker.number.int({ min: 100, max: 999 });
            } while (
                Products.some((product) => product.Number === uniqueNumber)
            );
            Products.push({
                id: count,
                ProductName: name,
                Number: uniqueNumber,
                SupplierID: i + 1,
            });
        }
    }

    return { Suppliers, Products };
};

const seedQualityForms = (id, status) => {
    // Generate our received and defective quantities
    let bigNum = faker.number.int({ min: 100, max: 2500 });
    let smallNum = faker.number.int({ min: 1, max: bigNum });

    // Get our product info
    let productID = faker.number.int({ min: 1, max: 90 });
    let product = Products.find((product) => product.id === productID);

    QualityForms.push({
        NCRFormID: id,
        NCRNumber: `${new Date().getFullYear()}-${String(id).padStart(3, "0")}`,
        SalesOrder: faker.number.int({ min: 100, max: 999 }),
        SRInspection: faker.datatype.boolean(),
        WorkInProgress: faker.datatype.boolean(),
        ItemDescription: product.ProductName,
        QuantityReceived: bigNum,
        QuantityDefective: smallNum,
        IsNonConforming: faker.datatype.boolean(),
        Details: faker.lorem.sentence(),
        QualityStatus: status,
        LastModified: faker.date.recent().toISOString().split("T")[0],
        ProductID: product.id,
    });

    FormUsers.push({
        NCRForm_id: id,
        User_id: 2,
    });

    return QualityForms[QualityForms.length - 1];
};

const seedEngineerForms = (id) => {
    let status = "Open";
    if (faker.datatype.boolean()) status = "Closed";

    let number = null;
    let date = null;
    let review = faker.helpers.arrayElement([
        "Use As Is",
        "Repair",
        "Rework",
        "Scrap",
    ]);
    let disposition = "";

    if (faker.datatype.boolean()) {
        number = `${faker.number.int({
            min: 100,
            max: 999,
        })}-${faker.string.alpha({ count: 1, upcase: true })}`;
        date = faker.date.recent().toISOString().split("T")[0];
    }

    if (review === "Repair" || review === "Rework") {
        disposition = faker.lorem.sentence();
    }

    EngineeringForms.push({
        NCRFormID: id,
        Review: review,
        NotifyCustomer: faker.datatype.boolean(),
        Disposition: disposition,
        RevisionNumber: number,
        RevisionDate: date,
        EngineerStatus: status,
        LastModified: faker.date.recent().toISOString().split("T")[0],
    });

    FormUsers.push({
        NCRForm_id: id,
        User_id: 3,
    });

    return EngineeringForms[EngineeringForms.length - 1];
};

const seedPurchasingForms = (id) => {
    let status = "Open";
    if (faker.datatype.boolean()) status = "Closed";

    let preliminaryDecision = faker.helpers.arrayElement([
        "Return To Supplier",
        "Rework In House",
        "Scrap",
        "Defer for HBC Engineering Review",
    ]);
    let carRaised = faker.datatype.boolean();
    let carNumber = carRaised
        ? faker.number.int({ min: 1000, max: 9999 })
        : null;
    let followUpRequired = faker.datatype.boolean();
    let followUpType = followUpRequired
        ? faker.helpers.arrayElement([
              "Corrective Action",
              "Preventitive Action",
          ])
        : null;
    let followUpDate = followUpRequired
        ? faker.date.future().toISOString().split("T")[0]
        : null;

    PurchasingForms.push({
        NCRFormID: id,
        PreliminaryDecision: preliminaryDecision,
        CARRaised: carRaised,
        CARNumber: carNumber,
        FollowUpRequired: followUpRequired,
        FollowUpType: followUpType,
        FollowUpDate: followUpDate,
        PurchasingStatus: status,
        LastModified: faker.date.recent().toISOString().split("T")[0],
    });

    FormUsers.push({
        NCRForm_id: id,
        User_id: 4,
    });

    return PurchasingForms[PurchasingForms.length - 1];
};

const seedNCRForms = () => {
    for (let i = 0; i < 100; i++) {
        let id = i + 1;

        // Generate a random status for our NCRForm
        let status = "Open";
        if (faker.datatype.boolean()) status = "Closed";

        // Create our NCRForm
        NCRForms.push({
            id: id,
            CreationDate: faker.date.past().toISOString().split("T")[0],
            LastModified: faker.date.recent().toISOString().split("T")[0],
            FormStatus: "Open",
        });

        let qlt, eng, pur;
        // Create our Quality Form
        qlt = seedQualityForms(id, status);

        if (qlt.QualityStatus === "Closed") {
            eng = seedEngineerForms(id);
        }
        if (eng && eng.EngineerStatus === "Closed") {
            pur = seedPurchasingForms(id);
        }
        if (
            eng &&
            pur &&
            eng.EngineerStatus === "Closed" &&
            pur.PurchasingStatus === "Closed"
        ) {
            NCRForms[i].FormStatus = "Closed";
        }
    }
    return NCRForms;
};

seedUsers();

const insertUsers = (users) => {
    const statement = users.map((user) => {
        return `INSERT INTO User (FName, MName, LName, Email, Password, RoleID) VALUES ('${user.FName}', '${user.MName}', '${user.LName}', '${user.Email}', '${user.Password}', ${user.RoleID});`;
    });
    return statement;
};

const insertSuppliers = (suppliers) => {
    const statement = suppliers.map((supplier) => {
        return `INSERT INTO Supplier (SupplierName) VALUES ('${supplier.SupplierName}');`;
    });
    return statement;
};

const insertProducts = (products) => {
    const statement = products.map((product) => {
        return `INSERT INTO Product (ProductName, Number, SupplierID) VALUES ('${product.ProductName}', ${product.Number}, ${product.SupplierID});`;
    });
    return statement;
};

const insertNCRForms = (forms) => {
    const statement = forms.map((ncr) => {
        return `INSERT INTO NCRForm (CreationDate, LastModified, FormStatus) VALUES ('${ncr.CreationDate}', '${ncr.LastModified}', '${ncr.FormStatus}');`;
    });
    return statement;
};

const insertFormUsers = (formUsers) => {
    const statement = formUsers.map((formUser) => {
        return `INSERT INTO FormUsers (NCRForm_id, User_id) VALUES (${formUser.NCRForm_id}, ${formUser.User_id});`;
    });
    return statement;
};

const insertQualityForms = (forms) => {
    const statement = forms.map((form) => {
        return `INSERT INTO Quality (NCRFormID, NCRNumber, SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, QualityStatus, LastModified, ProductID) VALUES (${form.NCRFormID}, '${form.NCRNumber}', ${form.SalesOrder}, ${form.SRInspection}, ${form.WorkInProgress}, '${form.ItemDescription}', ${form.QuantityReceived}, ${form.QuantityDefective}, ${form.IsNonConforming}, '${form.Details}', '${form.QualityStatus}', '${form.LastModified}', ${form.ProductID});`;
    });
    return statement;
};

const insertEngineerForms = (forms) => {
    const statement = forms.map((form) => {
        return `INSERT INTO Engineer (NCRFormID, Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, EngineerStatus, LastModified) VALUES (${form.NCRFormID}, '${form.Review}', ${form.NotifyCustomer}, '${form.Disposition}', '${form.RevisionNumber}', '${form.RevisionDate}', '${form.EngineerStatus}', '${form.LastModified}');`;
    });
    return statement;
};

const insertPurchasingForms = (forms) => {
    const statement = forms.map((form) => {
        return `INSERT INTO Purchasing (NCRFormID, PreliminaryDecision, CARRaised, CARNumber, FollowUpRequired, FollowUpType, FollowUpDate, PurchasingStatus, LastModified) VALUES (${form.NCRFormID}, '${form.PreliminaryDecision}', ${form.CARRaised}, ${form.CARNumber}, ${form.FollowUpRequired}, '${form.FollowUpType}', '${form.FollowUpDate}', '${form.PurchasingStatus}', '${form.LastModified}');`;
    });
    return statement;
};

const { Suppliers, Products } = seedSuppliers();

const User_INSERT = insertUsers(Users);

seedNCRForms();

const NCRForms_INSERT = insertNCRForms(NCRForms);
const FormUsers_INSERT = insertFormUsers(FormUsers);

const Suppliers_INSERT = insertSuppliers(Suppliers);
const Products_INSERT = insertProducts(Products);

const QualityForms_INSERT = insertQualityForms(QualityForms);
const EngineerForms_INSERT = insertEngineerForms(EngineeringForms);
const PurchasingForms_INSERT = insertPurchasingForms(PurchasingForms);

export const seedData = {
    User_INSERT,
    NCRForms_INSERT,
    FormUsers_INSERT,
    Suppliers_INSERT,
    Products_INSERT,
    QualityForms_INSERT,
    EngineerForms_INSERT,
    PurchasingForms_INSERT,
};
