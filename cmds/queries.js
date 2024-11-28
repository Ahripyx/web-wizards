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
        CARNumber INTEGER NOT NULL,
        FollowUpRequired BOOLEAN NOT NULL,
        FollowUpType STRING NOT NULL, 
        FollowUpDate DATETIME NOT NULL,
        PurchasingStatus STRING NOT NULL,
        LastModified DATETIME NOT NULL,
        FOREIGN KEY (NCRFormID) REFERENCES NCRForm(id)
    )`
];

export const dropTables = [
    'DROP TABLE IF EXISTS FormUsers',
    'DROP TABLE IF EXISTS Quality',
    'DROP TABLE IF EXISTS Engineer',
    'DROP TABLE IF EXISTS Product',
    'DROP TABLE IF EXISTS Supplier',
    'DROP TABLE IF EXISTS User',
    'DROP TABLE IF EXISTS Role',
    'DROP TABLE IF EXISTS NCRForm'
];

export const seedTables = [
    `INSERT INTO Role (Title) VALUES 
        ('Admin'),
        ('Inspector'),
        ('Engineer')`,
    `INSERT INTO User (FName, MName, LName, Email, Password, RoleID) VALUES 
        ('Alan', 'W', 'Wake', 'alan.wake@crossfire.ca', 'password123', 1), 
        ('Parappa', 'tha', 'Rappa', 'parappa.rappa@crossfire.ca', 'password123', 2), 
        ('Cave', 'G', 'Johnson', 'cave.johnson@crossfire.ca', 'password123', 3),
        ('Alduin', 'Twilight', 'World Eater', 'admin@crossfire.ca', 'admin', 1),
        ('Quality', 'Q', 'Mann', 'quality@crossfire.ca', 'quality', 2),
        ('Engineer', 'E', 'Womann', 'engineer@crossfire.ca', 'engineer', 3)`,
    `INSERT INTO NCRForm (CreationDate, LastModified, FormStatus) VALUES 
        ('2024-10-12', '2024-10-12', 'Open'),
        ('2024-02-08', '2024-02-08', 'Open'),
        ('2024-05-20', '2024-05-20', 'Open'),
        ('2024-08-29', '2024-08-29', 'Open'),
        ('2024-03-24', '2024-03-24', 'Open'),
        ('2024-10-14', '2024-10-14', 'Open'),
        ('2024-10-16', '2024-10-16', 'Open'),
        ('2024-10-18', '2024-10-18', 'Open'),
        ('2024-10-20', '2024-10-20', 'Open'),
        ('2024-10-02', '2024-10-02', 'Open'),
        ('2024-10-04', '2024-10-04', 'Open'),
        ('2024-10-06', '2024-10-06', 'Open'),
        ('2024-10-08', '2024-10-08', 'Open'),
        ('2024-10-10', '2024-10-10', 'Open'),
        ('2024-10-12', '2024-10-12', 'Open'),
        ('2024-10-14', '2024-10-14', 'Open'),
        ('2024-10-16', '2024-10-16', 'Open'),
        ('2024-10-18', '2024-10-18', 'Open'),
        ('2024-10-20', '2024-10-20', 'Open'),
        ('2024-10-02', '2024-10-02', 'Open'),
        ('2024-10-04', '2024-10-04', 'Open'),
        ('2024-10-06', '2024-10-06', 'Open'),
        ('2024-10-08', '2024-10-08', 'Open'),
        ('2024-10-10', '2024-10-10', 'Open'),
        ('2024-10-12', '2024-10-12', 'Open'),
        ('2024-10-14', '2024-10-14', 'Open'),
        ('2024-10-16', '2024-10-16', 'Open'),
        ('2024-10-18', '2024-10-18', 'Open'),
        ('2024-10-20', '2024-10-20', 'Open'),
        ('2024-10-02', '2024-10-02', 'Open'),
        ('2024-11-01', '2024-11-01', 'Open'),
        ('2024-11-03', '2024-11-03', 'Open'),
        ('2024-11-05', '2024-11-05', 'Open'),
        ('2024-11-07', '2024-11-07', 'Open'),
        ('2024-11-09', '2024-11-09', 'Open'),
        ('2024-11-11', '2024-11-11', 'Open'),
        ('2024-11-13', '2024-11-13', 'Open'),
        ('2024-11-15', '2024-11-15', 'Open'),
        ('2024-11-17', '2024-11-17', 'Open'),
        ('2024-11-19', '2024-11-19', 'Open'),
        ('2024-11-21', '2024-11-21', 'Open'),
        ('2024-11-23', '2024-11-23', 'Open'),
        ('2024-11-25', '2024-11-25', 'Open'),
        ('2024-11-27', '2024-11-27', 'Open'),
        ('2024-11-29', '2024-11-29', 'Open'),
        ('2024-12-01', '2024-12-01', 'Open'),
        ('2024-12-03', '2024-12-03', 'Open'),
        ('2024-12-05', '2024-12-05', 'Open'),
        ('2024-12-07', '2024-12-07', 'Open'),
        ('2024-12-09', '2024-12-09', 'Open'),
        ('2024-12-11', '2024-12-11', 'Open'),
        ('2024-12-13', '2024-12-13', 'Open'),
        ('2024-12-15', '2024-12-15', 'Open'),
        ('2024-12-17', '2024-12-17', 'Open'),
        ('2024-12-19', '2024-12-19', 'Open'),
        ('2024-12-21', '2024-12-21', 'Open'),
        ('2024-12-23', '2024-12-23', 'Open'),
        ('2024-12-25', '2024-12-25', 'Open'),
        ('2024-12-27', '2024-12-27', 'Open'),
        ('2024-12-29', '2024-12-29', 'Open')`,
    `INSERT INTO FormUsers (NCRForm_ID, User_ID) VALUES 
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 1),
        (6, 2),
        (7, 3),
        (8, 4),
        (9, 1),
        (10, 2),
        (11, 3),
        (12, 4),
        (13, 1),
        (14, 2),
        (15, 3),
        (16, 4),
        (17, 1),
        (18, 2),
        (19, 3),
        (20, 4),
        (21, 1),
        (22, 2),
        (23, 3),
        (24, 4),
        (25, 1),
        (26, 2),
        (27, 3),
        (28, 4),
        (29, 1),
        (30, 2),
        (31, 3),
        (32, 4),
        (33, 1),
        (34, 2),
        (35, 3),
        (36, 4),
        (37, 1),
        (38, 2),
        (39, 3),
        (40, 4),
        (41, 1),
        (42, 2),
        (43, 3),
        (44, 4),
        (45, 1),
        (46, 2),
        (47, 3),
        (48, 4),
        (49, 1),
        (50, 2),
        (51, 3),
        (52, 4),
        (53, 1),
        (54, 2),
        (55, 3),
        (56, 4),
        (57, 1),
        (58, 2),
        (59, 3),
        (60, 4)`,
    `INSERT INTO Supplier (SupplierName) VALUES 
        ('Ace Fasteners'), 
        ('Best Bolts Co.'), 
        ('HomePro Tools'), 
        ('Reliable Paints'),
        ('Grainger'),
        ('Fastenal'),
        ('MSC Industrial Supply'),
        ('Airgas'), ('HD Supply'),
        ('Applied Industrial Technologies'),
        ('Motion Industries'),
        ('Parker Hannifin'),
        ('Kaman Industrial Technologies'),
        ('W.W. Williams'),
        ('Ingersoll Rand'),
        ('Reliance Electric'),
        ('Eaton Corporation'),
        ('3M'),('Emerson Electric'),
        ('Siemens'),
        ('ABB'),
        ('Rexel'),
        ('Ferguson'),
        ('Graybar'), 
        ('Top Electrical Supplies')`,
    `INSERT INTO Product (ProductName, Number, SupplierID) VALUES
                ('Ball Bearing', '834', '7'),
                ('Steel Pipe', '562', '12'),
                ('Hydraulic Pump', '299', '15'),
                ('Industrial Fan', '129', '6'),
                ('Electric Motor', '453', '14'),
                ('Air Compressor', '378', '9'),
                ('Welding Machine', '274', '3'),
                ('Safety Gloves', '651', '10'),
                ('Conveyor Belt', '569', '4'),
                ('Pressure Gauge', '183', '16'),
                ('Industrial Hose', '432', '8'),
                ('Circuit Breaker', '119', '19'),
                ('LED Work Light', '506', '5'),
                ('Lubricant Oil', '211', '13'),
                ('Gear Reducer', '743', '20'),
                ('Pneumatic Cylinder', '928', '7'),
                ('Torque Wrench', '335', '11'),
                ('Safety Helmet', '484', '2'),
                ('Power Supply Unit', '626', '6'),
                ('Filter Cartridge', '235', '10'),
                ('Welding Rod', '372', '4'),
                ('Sprocket Gear', '818', '12'),
                ('Industrial Valve', '596', '9'),
                ('Hand Tool Set', '219', '15'),
                ('Bearing Grease', '753', '8'),
                ('Hydraulic Oil', '102', '5'),
                ('Protective Goggles', '618', '11'),
                ('V-Belt', '358', '3'),
                ('Control Panel', '480', '17'),
                ('Lifting Chain', '705', '2'),
                ('Electric Drill', '823', '14'),
                ('Industrial Fasteners', '369', '18'),
                ('Pipe Fittings', '291', '7'),
                ('Steel Cable', '745', '19'),
                ('Work Boots', '631', '12'),
                ('Cooling Fan', '590', '16'),
                ('Cutting Disc', '197', '9'),
                ('Battery Charger', '863', '4'),
                ('Industrial Adhesive', '534', '13'),
                ('Ball Valve', '402', '8'),
                ('Wrench Set', '342', '10'),
                ('Gas Cylinder', '216', '1'),
                ('Rubber Gasket', '155', '6'),
                ('Air Filter', '694', '20'),
                ('Hose Clamps', '118', '3'),
                ('Safety Mask', '853', '15'),
                ('Roller Chain', '217', '5'),
                ('Industrial Hammer', '477', '11'),
                ('Tool Box', '269', '18'),
                ('Grinder Disc', '685', '7'),
                ('Angle Grinder', '538', '9'),
                ('Sealing Tape', '407', '14'),
                ('Pipe Wrench', '972', '8'),
                ('Hydraulic Jack', '502', '13'),
                ('Industrial Tape', '401', '2'),
                ('Heat Gun', '648', '4'),
                ('Pallet Jack', '214', '16'),
                ('Electric Saw', '537', '12'),
                ('Pressure Washer', '873', '10'),
                ('Cutting Oil', '439', '6'),
                ('Industrial Pulley', '178', '20'),
                ('Socket Set', '496', '1'),
                ('Machine Oil', '738', '17'),
                ('Safety Vest', '983', '11'),
                ('Handheld Radio', '691', '5'),
                ('Grinding Wheel', '294', '9'),
                ('Plastic Container', '825', '7'),
                ('Welding Helmet', '167', '15'),
                ('Impact Drill', '782', '14'),
                ('Rubber Mat', '597', '8'),
                ('PPE Kit', '202', '3'),
                ('Air Blower', '452', '18'),
                ('Locking Pliers', '629', '10'),
                ('Industrial Fan Belt', '331', '13'),
                ('Sandpaper Roll', '914', '19'),
                ('Extension Cord', '573', '6'),
                ('Oil Filter', '157', '5'), 
                ('Hydraulic Hose', '912', '4'),
                ('Tool Belt', '413', '12'),
                ('Lifting Strap', '678', '8'),
                ('Hand Saw', '287', '16'),
                ('Safety Harness', '923', '2'),
                ('Cleaning Brush', '492', '9'),
                ('Industrial Cleaner', '734', '11'),
                ('Storage Bin', '599', '4'),
                ('Metal File', '284', '15'),
                ('Work Light', '856', '10'),
                ('Grease Gun', '320', '3'),
                ('Tool Cart', '765', '7'),
                ('Chain Hoist', '509', '20'),
                ('Hearing Protection', '476', '13'),
                ('Rubber Gloves', '512', '6'),
                ('Dust Mask', '670', '19'),
                ('Work Apron', '839', '14'),
                ('Utility Knife', '491', '17'),
                ('Pallet Rack', '303', '12'),
                ('Wire Stripper', '918', '5'),
                ('Grease Fitting', '175', '18'),
                ('Metal Clamp', '463', '1'),
                ('Tool Organizer', '105', '6')`,
    `INSERT INTO Quality (NCRFormID, NCRNumber, SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, QualityStatus, LastModified, ProductID) VALUES 
                (1, '2024-001', 309, 1, 1, 'Circuit Breaker', 99, 47, 1, 'Breaker trips frequently', 'Closed', '2024-10-12', 12),
                (2, '2024-002', 333, 1, 1, 'Cutting Oil', 42, 20, 1, 'Received AW46 oil instead of the AW32 oil', 'Closed', '2024-02-08', 26),
                (3, '2024-003', 978, 1, 0, 'Safety Helmet', 65, 12, 1, 'Helmet straps are broken', 'Closed', '2024-05-20', 18),
                (4, '2024-004', 251, 0, 1, 'Wrench Set', 60, 15, 1, 'Wrenches are bending under pressure', 'Closed', '2024-08-29', 41),
                (5, '2024-005', 896, 1, 1, 'Cutting Disc', 50, 13, 1, 'Discs are breaking during use', 'Closed', '2024-03-24', 37),
                (6, '2024-006', 123, 1, 0, 'Ball Bearing', 100, 20, 1, 'Bearings are not correctly assembled', 'Closed', '2024-10-14', 1),
                (7, '2024-007', 478, 0, 1, 'Industrial Hose', 20, 1, 1, 'Hose has a hole in it', 'Closed', '2024-10-16', 11),
                (8, '2024-008', 499, 1, 0, 'Safety Helmet', 50, 5, 1, 'Helmet straps are broken', 'Closed', '2024-10-18', 18),
                (9, '2024-009', 910, 0, 1, 'Hydraulic Oil', 100, 50, 1, 'Received AW46 oil instead of the AW32 oil', 'Closed', '2024-10-20', 26),
                (10, '2024-010', 376, 1, 0, 'Industrial Hammer', 50, 5, 1, 'Hammer handles are loose', 'Closed', '2024-10-02', 48),
                (11, '2024-011', 392, 0, 1, 'Impact Drill', 30, 3, 1, 'Drill motors are faulty', 'Closed', '2024-10-04', 69),
                (12, '2024-012', 222, 1, 0, 'Safety Mask', 100, 25, 1, 'Mask straps are broken', 'Closed', '2024-10-06', 22),
                (13, '2024-013', 408, 0, 1, 'Safety Harness', 10, 3, 1, 'Clasps are broken', 'Closed', '2024-10-08', 23),
                (14, '2024-014', 121, 1, 0, 'Tool Box', 5, 1, 1, 'Hinge is broken on 1 unit', 'Closed', '2024-10-10', 49),
                (15, '2024-015', 421, 0, 1, 'Sealing Tape', 250, 1, 1, 'Tape isnt sticky', 'Closed', '2024-10-12', 52),
                (16, '2024-016', 123, 1, 0, 'Ball Bearing', 100, 20, 1, 'Bearings are not correctly assembled', 'Closed', '2024-10-14', 1),
                (17, '2024-017', 478, 0, 1, 'Industrial Hose', 20, 1, 1, 'Hose has a hole in it', 'Closed', '2024-10-16', 11),
                (18, '2024-018', 499, 1, 0, 'Safety Helmet', 50, 5, 1, 'Helmet straps are broken', 'Closed', '2024-10-18', 18),
                (19, '2024-019', 910, 0, 1, 'Hydraulic Oil', 100, 50, 1, 'Received AW46 oil instead of the AW32 oil', 'Closed', '2024-10-20', 26),
                (20, '2024-020', 376, 1, 0, 'Industrial Hammer', 50, 5, 1, 'Hammer handles are loose', 'Closed', '2024-10-02', 48),
                (21, '2024-021', 392, 0, 1, 'Impact Drill', 30, 3, 1, 'Drill motors are faulty', 'Open', '2024-10-04', 69),
                (22, '2024-022', 222, 1, 0, 'Safety Mask', 100, 25, 1, 'Mask straps are broken', 'Open', '2024-10-06', 22),
                (23, '2024-023', 408, 0, 1, 'Safety Harness', 10, 3, 1, 'Clasps are broken', 'Open', '2024-10-08', 23),
                (24, '2024-024', 121, 1, 0, 'Tool Box', 5, 1, 1, 'Hinge is broken on 1 unit', 'Open', '2024-10-10', 49),
                (25, '2024-025', 421, 0, 1, 'Sealing Tape', 250, 1, 1, 'Tape isnt sticky', 'Open', '2024-10-12', 52),
                (26, '2024-026', 123, 1, 0, 'Ball Bearing', 100, 20, 1, 'Bearings are not correctly assembled', 'Open', '2024-10-14', 1),
                (27, '2024-027', 478, 0, 1, 'Industrial Hose', 20, 1, 1, 'Hose has a hole in it', 'Open', '2024-10-16', 11),
                (28, '2024-028', 499, 1, 0, 'Safety Helmet', 50, 5, 1, 'Helmet straps are broken', 'Open', '2024-10-18', 18),
                (29, '2024-029', 910, 0, 1, 'Hydraulic Oil', 100, 50, 1, 'Received AW46 oil instead of the AW32 oil', 'Open', '2024-10-20', 26),
                (30, '2024-030', 376, 1, 0, 'Industrial Hammer', 50, 5, 1, 'Hammer handles are loose', 'Open', '2024-10-02', 48),
                (31, '2024-038', 512, 1, 0, 'Electric Motor', 40, 8, 1, 'Motors are overheating', 'Open', '2024-11-01', 5),
                (32, '2024-039', 613, 0, 1, 'Air Compressor', 25, 5, 1, 'Compressors are leaking air', 'Open', '2024-11-03', 6),
                (33, '2024-040', 714, 1, 0, 'Welding Machine', 15, 3, 1, 'Welders are not igniting', 'Open', '2024-11-05', 7),
                (34, '2024-041', 815, 0, 1, 'Safety Gloves', 100, 20, 1, 'Gloves have holes', 'Open', '2024-11-07', 8),
                (35, '2024-042', 916, 1, 0, 'Conveyor Belt', 30, 6, 1, 'Belts are misaligned', 'Open', '2024-11-09', 9),
                (36, '2024-043', 101, 0, 1, 'Pressure Gauge', 50, 10, 1, 'Gauges are not calibrated', 'Open', '2024-11-11', 10),
                (37, '2024-044', 202, 1, 0, 'Industrial Hose', 20, 4, 1, 'Hoses are cracking', 'Open', '2024-11-13', 11),
                (38, '2024-045', 303, 0, 1, 'Circuit Breaker', 60, 12, 1, 'Breakers are not resetting', 'Open', '2024-11-15', 12),
                (39, '2024-046', 404, 1, 0, 'LED Work Light', 80, 16, 1, 'Lights are flickering', 'Open', '2024-11-17', 13),
                (40, '2024-047', 505, 0, 1, 'Lubricant Oil', 100, 20, 1, 'Oil is contaminated', 'Open', '2024-11-19', 14),
                (41, '2024-048', 606, 1, 0, 'Gear Reducer', 10, 2, 1, 'Reducers are noisy', 'Open', '2024-11-21', 15),
                (42, '2024-049', 707, 0, 1, 'Pneumatic Cylinder', 30, 6, 1, 'Cylinders are leaking', 'Open', '2024-11-23', 16),
                (43, '2024-050', 808, 1, 0, 'Torque Wrench', 20, 4, 1, 'Wrenches are not accurate', 'Open', '2024-11-25', 17),
                (44, '2024-051', 909, 0, 1, 'Safety Helmet', 50, 10, 1, 'Helmets are cracked', 'Open', '2024-11-27', 18),
                (45, '2024-052', 110, 1, 0, 'Power Supply Unit', 40, 8, 1, 'Units are not powering on', 'Open', '2024-11-29', 19),
                (46, '2024-053', 211, 0, 1, 'Filter Cartridge', 60, 12, 1, 'Cartridges are clogged', 'Open', '2024-12-01', 20),
                (47, '2024-054', 312, 1, 0, 'Welding Rod', 100, 20, 1, 'Rods are brittle', 'Open', '2024-12-03', 21),
                (48, '2024-055', 413, 0, 1, 'Sprocket Gear', 30, 6, 1, 'Gears are misaligned', 'Open', '2024-12-05', 22),
                (49, '2024-056', 514, 1, 0, 'Industrial Valve', 20, 4, 1, 'Valves are leaking', 'Open', '2024-12-07', 23),
                (50, '2024-057', 615, 0, 1, 'Hand Tool Set', 50, 10, 1, 'Tools are rusted', 'Open', '2024-12-09', 24),
                (51, '2024-058', 716, 1, 0, 'Bearing Grease', 100, 20, 1, 'Grease is contaminated', 'Open', '2024-12-11', 25),
                (52, '2024-059', 817, 0, 1, 'Hydraulic Oil', 100, 20, 1, 'Oil is contaminated', 'Open', '2024-12-13', 26),
                (53, '2024-060', 918, 1, 0, 'Protective Goggles', 50, 10, 1, 'Goggles are scratched', 'Open', '2024-12-15', 27),
                (54, '2024-061', 119, 0, 1, 'V-Belt', 30, 6, 1, 'Belts are slipping', 'Open', '2024-12-17', 28),
                (55, '2024-062', 220, 1, 0, 'Control Panel', 20, 4, 1, 'Panels are not responding', 'Open', '2024-12-19', 29),
                (56, '2024-063', 321, 0, 1, 'Lifting Chain', 10, 2, 1, 'Chains are breaking', 'Open', '2024-12-21', 30),
                (57, '2024-064', 422, 1, 0, 'Electric Drill', 30, 6, 1, 'Drills are overheating', 'Open', '2024-12-23', 31),
                (58, '2024-065', 523, 0, 1, 'Industrial Fasteners', 100, 20, 1, 'Fasteners are rusted', 'Open', '2024-12-25', 32),
                (59, '2024-066', 624, 1, 0, 'Pipe Fittings', 50, 10, 1, 'Fittings are leaking', 'Open', '2024-12-27', 33),
                (60, '2024-067', 725, 0, 1, 'Steel Cable', 20, 4, 1, 'Cables are fraying', 'Open', '2024-12-29', 34)`,
    `INSERT INTO Engineer (NCRFormID, Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, EngineerStatus, LastModified) VALUES 
                (1, 'Rework', 0, 'Accepted with Rework', '399-B', '2024-10-03', 'Closed', '2024-10-02'), 
                (2, 'Scrap', 1, 'Rejected', NULL, NULL, 'Closed', '2024-10-04'), 
                (3, 'Repair', 0, 'Approved', '456-C', '2024-10-07', 'Closed', '2024-10-06'), 
                (4, 'Repair', 0, 'Approved', NULL, NULL, 'Closed', '2024-10-09'), 
                (5, 'Repair', 1, 'Approved', NULL, NULL, 'Closed', '2024-10-12'), 
                (6, 'Scrap', 1, 'Approved', '354-A', '2024-10-13', 'Closed', '2024-10-13'), 
                (7, 'Rework', 0, 'Approved', '576-B', '2024-10-16', 'Closed', '2024-10-16'), 
                (8, 'Scrap', 1, 'Approved', '234-A', '2024-10-17', 'Closed', '2024-10-18'), 
                (9, 'Use As Is', 0, 'Approved', NULL, NULL, 'Closed', '2024-10-18'), 
                (10, 'Rework', 1, 'Approved with rework', NULL, NULL, 'Closed', '2024-10-22'),
                (11, 'Rework', 0, 'Accepted with Rework', '400-B', '2024-10-23', 'Closed', '2024-10-22'), 
                (12, 'Scrap', 1, 'Rejected', NULL, NULL, 'Closed', '2024-10-24'), 
                (13, 'Repair', 0, 'Approved', '457-C', '2024-10-25', 'Closed', '2024-10-24'), 
                (14, 'Repair', 0, 'Approved', NULL, NULL, 'Closed', '2024-10-26'), 
                (15, 'Repair', 1, 'Approved', NULL, NULL, 'Closed', '2024-10-27'), 
                (16, 'Scrap', 1, 'Approved', '355-A', '2024-10-28', 'Closed', '2024-10-28'), 
                (17, 'Rework', 0, 'Approved', '577-B', '2024-10-29', 'Closed', '2024-10-29'), 
                (18, 'Scrap', 1, 'Approved', '235-A', '2024-10-30', 'Closed', '2024-10-30'), 
                (19, 'Use As Is', 0, 'Approved', NULL, NULL, 'Closed', '2024-11-01'), 
                (20, 'Rework', 1, 'Approved with rework', NULL, NULL, 'Closed', '2024-11-02'),
                (21, 'Rework', 0, 'Accepted with Rework', '401-B', '2024-11-03', 'Open', '2024-11-02'), 
                (22, 'Scrap', 1, 'Rejected', NULL, NULL, 'Open', '2024-11-04'), 
                (23, 'Repair', 0, 'Approved', '458-C', '2024-11-05', 'Open', '2024-11-04'), 
                (24, 'Repair', 0, 'Approved', NULL, NULL, 'Open', '2024-11-06'), 
                (25, 'Repair', 1, 'Approved', NULL, NULL, 'Open', '2024-11-07'), 
                (26, 'Scrap', 1, 'Approved', '356-A', '2024-11-08', 'Open', '2024-11-08'), 
                (27, 'Rework', 0, 'Approved', '578-B', '2024-11-09', 'Open', '2024-11-09'), 
                (28, 'Scrap', 1, 'Approved', '236-A', '2024-11-10', 'Open', '2024-11-10'), 
                (29, 'Use As Is', 0, 'Approved', NULL, NULL, 'Open', '2024-11-11'), 
                (30, 'Rework', 1, 'Approved with rework', NULL, NULL, 'Open', '2024-11-12'), 
                (31, 'Rework', 0, 'Accepted with Rework', '402-B', '2024-11-13', 'Open', '2024-11-12'), 
                (32, 'Scrap', 1, 'Rejected', NULL, NULL, 'Open', '2024-11-14'), 
                (33, 'Repair', 0, 'Approved', '459-C', '2024-11-15', 'Open', '2024-11-14'), 
                (34, 'Repair', 0, 'Approved', NULL, NULL, 'Open', '2024-11-16'), 
                (35, 'Repair', 1, 'Approved', NULL, NULL, 'Open', '2024-11-17'), 
                (36, 'Scrap', 1, 'Approved', '357-A', '2024-11-18', 'Open', '2024-11-18'), 
                (37, 'Rework', 0, 'Approved', '579-B', '2024-11-19', 'Open', '2024-11-19'), 
                (38, 'Scrap', 1, 'Approved', '237-A', '2024-11-20', 'Open', '2024-11-20'), 
                (39, 'Use As Is', 0, 'Approved', NULL, NULL, 'Open', '2024-11-21'), 
                (40, 'Rework', 1, 'Approved with rework', NULL, NULL, 'Open', '2024-11-22')`,
    //`INSERT INTO Purchasing (NCRFormID, PreliminaryDecision, CARRaised, CARNumber, FollowUpRequired, FollowUpType, FollowUpDate, PurchasingStatus, LastModified) VALUES`
];