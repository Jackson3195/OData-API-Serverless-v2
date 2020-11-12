export namespace Entity {

    export interface Property {
        Id: number;
        LandlordId: number;
        AddressLine1: string;
        City: string;
        CreatedOn: string | Date;
        LastUpdatedOn: string | Date;
        LastUpdatedBy: string;
        Obsolete: boolean;
        ObsoletedOn: string | Date | null;
        ObsoletedBy: string | null;
        Landlord: User;
    }

    export interface PropertyUser {
        PropertyId: number;
        UserId: number;
        Data1: string;
    }

    export interface User {
        Id: number;
        Firstname: string;
        Surname: string;
        CreatedOn: string | Date;
        LastUpdatedOn: string | Date;
        LastUpdatedBy: string;
        Obsolete: boolean;
        ObsoletedOn: string | Date | null;
        ObsoletedBy: string | null;
        Portfolio: Property[];
    }

}
