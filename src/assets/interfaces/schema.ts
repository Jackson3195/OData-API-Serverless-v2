export type Visability = 'Internal' | 'External';

export interface Schema {
    [k: string]: {
        Owner: string;
        Tablename: string;
        Core: boolean;
        PrimaryKey: string[];
        Attributes: {
            [k: string]: FieldAttribute | ReferenceAttribute;
        };
    };
}

export interface FieldAttribute extends AttributeMetadata {
    Type: 'Field';
    SQL: SQLMetadata;
}

export interface ReferenceAttribute extends AttributeMetadata {
    Type: 'Reference';
    Navigation: NavigationMetadata;
}

export interface AttributeMetadata {
    Visible: Visability;
    Type: 'Field' | 'Reference';
}

export interface SQLMetadata {
    Name: string;
    Type: string;
    Size: number | null;
}

export interface NavigationMetadata {
    ToEntity: string;
    ToField: string;
    FromField: string;
    Context: 'Parent' | 'Child';
    Bespoke: boolean;
}
