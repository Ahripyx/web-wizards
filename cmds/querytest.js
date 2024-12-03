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

const NCRForms = [];
const QualityForms = [];
const EngineeringForms = [];

const seedSuppliers = () => {
    const Suppliers = [];
    const Products = [];

    let count = 0;
    for (let i = 0; i < 30; i++) {
        Suppliers.push({
            id: i + 1,
            SupplierName: faker.company.name(),
        });

        for (let j = 0; j < 3; j++) {
            count++;
            Products.push({
                id: count,
                ProductName: faker.commerce.productName(),
                Number: faker.number.int({ min: 100, max: 999 }),
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

    return EngineeringForms[EngineeringForms.length - 1];
};

const seedPurchasingForms = (id) => {
    let status = "Open";
    if (faker.datatype.boolean()) status = "Closed";

    let preliminaryDecision = faker.helpers.arrayElement([
        "Return To Supplier",
        "Rework In House",
        "Scrap",
        "Defer for HBC Engineering Review"
    ]);
    let carRaised = faker.datatype.boolean();
    let carNumber = carRaised ? faker.number.int({ min: 1000, max: 9999 }) : null;
    let followUpRequired = faker.datatype.boolean();
    let followUpType = followUpRequired
        ? faker.helpers.arrayElement(["Email", "Phone", "Meeting"])
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

        // Create our Quality Form
        let qlt = seedQualityForms(id, status);

        if (qlt.QualityStatus === "Closed") {
            let eng = seedEngineerForms(id);
        }
        if (eng.EngineerStatus === "Closed") {
            let pur = seedPurchasingForms(id);
        }
    }
    return NCRForms;
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

const { Suppliers, Products } = seedSuppliers();

const Suppliers_INSERT = insertSuppliers(Suppliers);
const Products_INSERT = insertProducts(Products);

seedNCRForms();
const NCRForms_INSERT = insertNCRForms(NCRForms);

/*NCRForms_INSERT.forEach(statement => {
    console.log(statement);
});*/
