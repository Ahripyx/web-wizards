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
        NCRFormID INTEGER NOT NULL,
        UserID INTEGER NOT NULL,
        PRIMARY KEY (NCRFormID, UserID),
        FOREIGN KEY (NCRFormID) REFERENCES NCRForm(id) ON DELETE CASCADE,
        FOREIGN KEY (UserID) REFERENCES User(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS Supplier (
        id INTEGER PRIMARY KEY,
        Name STRING NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS Product (
        id INTEGER PRIMARY KEY,
        Name STRING NOT NULL,
        Number INTEGER NOT NULL,
        SupplierID INTEGER NOT NULL,
        FOREIGN KEY (SupplierID) REFERENCES Supplier(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Quality (
        NCRFormID INTEGER PRIMARY KEY,
        NCRNumber STRING NOT NULL,
        SRInspection BOOLEAN NOT NULL,
        WorkInProgress BOOLEAN NOT NULL,
        ItemDescription STRING NOT NULL,
        QuantityReceived INTEGER NOT NULL,
        QuantityDefective INTEGER NOT NULL,
        IsNonConforming BOOLEAN NOT NULL,
        Details STRING NOT NULL,
        LastModified DATETIME NOT NULL,
        ProductID INTEGER NOT NULL,
        FOREIGN KEY (NCRFormID) REFERENCES NCRForm(id),
        FOREIGN KEY (ProductID) REFERENCES Product(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Engineer (
        NCRFormID INTEGER PRIMARY KEY,
        Disposition STRING NOT NULL,
        DrawingUpdateRequired BOOLEAN NOT NULL,
        CurrentRevisionNumber INTEGER,
        NewRevisionNumber INTEGER,
        RevisionDate DATETIME,
        LastModified DATETIME NOT NULL,
        FOREIGN KEY (NCRFormID) REFERENCES NCRForm(id)
    )`
];

export const seedTables = [
    `INSERT INTO Role (Title) VALUES 
        ('Admin'),
        ('Engineer'), 
        ('Inspector')`,
    `INSERT INTO User (FName, MName, LName, Email, Password, RoleID) VALUES 
        ('Alan', 'W', 'Wake', 'alan.wake@example.com', 'password123', 1), 
        ('Parappa', 'tha', 'Rappa', 'parappa.rappa@example.com', 'password123', 2), 
        ('Cave', 'G', 'Johnson', 'cave.johnson@example.com', 'password123', 3),
        ('Alduin', 'Twilight', 'World Eater', 'alduin.worldeater@example.com', 'password123', 3)`,
    `INSERT INTO NCRForm (CreationDate, LastModified, FormStatus) VALUES 
        ('2024-10-01', '2024-10-02', 'Open'), 
        ('2024-10-03', '2024-10-04', 'Open'), 
        ('2024-10-05', '2024-10-06', 'Closed')`,
    `INSERT INTO FormUsers (NCRFormID, UserID) VALUES 
        (1, 1), 
        (1, 2), 
        (2, 3), 
        (3, 4)`,
    `INSERT INTO Supplier (Name) VALUES 
        ('Ace Fasteners'), 
        ('Best Bolts Co.'), 
        ('HomePro Tools'), 
        ('Reliable Paints'), 
        ('Top Electrical Supplies')`,
    `INSERT INTO Product (Name, Number, SupplierID) VALUES 
        ('Hammer', 101, 3), 
        ('Drill', 102, 3), 
        ('Paint Can', 201, 4), 
        ('Light Bulb', 301, 5), 
        ('Box of Screws', 401, 1), 
        ('Bag of Bolts', 402, 2)`,
    `INSERT INTO Quality (NCRFormID, NCRNumber, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, LastModified, ProductID) VALUES 
        (1, 'NCR001', 1, 0, 'Hammer - Handle loose', 50, 5, 1, 'Loose hammer handles on 5 units.', '2024-10-02', 1), 
        (2, 'NCR002', 0, 1, 'Drill - Motor issue', 30, 3, 1, '3 drills with faulty motors.', '2024-10-04', 2), 
        (3, 'NCR003', 1, 0, 'Paint Can - Lid issues', 100, 7, 1, 'Paint can lids not sealing properly.', '2024-10-06', 3)`,
    `INSERT INTO Engineer (NCRFormID, Disposition, DrawingUpdateRequired, CurrentRevisionNumber, NewRevisionNumber, RevisionDate, LastModified) VALUES 
        (1, 'Accepted with Rework', 1, 1, 2, '2024-10-03', '2024-10-02'), 
        (2, 'Rejected', 0, 1, NULL, NULL, '2024-10-04'), 
        (3, 'Approved', 1, 2, 3, '2024-10-07', '2024-10-06')`
];