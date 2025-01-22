export interface Articles {
    code:         number;
    message:      string;
    items:        Item[];
    page_context: PageContext;
}

export interface Item {
    item_id:                string;
    name:                   string;
    item_name:              string;
    unit:                   Unit;
    status:                 Status;
    source:                 Source;
    is_linked_with_zohocrm: boolean;
    zcrm_product_id:        string;
    description:            string;
    rate:                   number;
    tax_id:                 TaxID;
    tax_name:               TaxName;
    tax_percentage:         number;
    can_be_sold:            boolean;
    can_be_purchased:       boolean;
    product_type:           ProductType;
    has_attachment:         boolean;
    sku:                    string;
    image_name:             string;
    image_type:             ImageType;
    image_document_id:      string;
    created_time:           string;
    last_modified_time:     string;
    show_in_storefront:     boolean;
    track_inventory?:       boolean;
}

export enum ImageType {
    Empty = "",
    ImageTypeJPG = "JPG",
    JPEG = "jpeg",
    Jpg = "jpg",
    PNG = "png",
}

export enum ProductType {
    Goods = "goods",
}

export enum Source {
    User = "user",
}

export enum Status {
    Active = "active",
    Inactive = "inactive",
}

export enum TaxID {
    Empty = "",
    The386031000000021062 = "386031000000021062",
}

export enum TaxName {
    Empty = "",
    IVA = "I.V.A.",
}

export enum Unit {
    Bote = "Bote",
    Cartucho = "Cartucho",
    Empty = "",
    Kit4Piezas = "Kit 4 Piezas",
    Kit5Piezas = "Kit 5 Piezas",
    Pieza = "Pieza",
    Servicio = "Servicio",
}

export interface PageContext {
    page:           number;
    per_page:       number;
    has_more_page:  boolean;
    report_name:    string;
    applied_filter: string;
    custom_fields:  any[];
    sort_column:    string;
    sort_order:     string;
}
