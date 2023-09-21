export type EPCRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type EPCItem = {
  EPC_ADDRESS1: string;
  EPC_ADDRESS2: string;
  EPC_ADDRESS3: string;
  EPC_POSTCODE: string;
  EPC_CURRENT_ENERGY_RATING: EPCRating;
  EPC_PROPERTY_TYPE: string;
  EPC_BUILT_FORM: string;
  EPC_INSPECTION_DATE: number;
  EPC_TOTAL_FLOOR_AREA: number;
  EPC_NUMBER_HABITABLE_ROOMS: number;
  EPC_WINDOWS_ENERGY_EFF: string;
  EPC_WALLS_ENERGY_EFF: string;
  EPC_ROOF_ENERGY_EFF: string;
  EPC_MAINHEAT_ENERGY_EFF: string;
  EPC_LIGHTING_ENERGY_EFF: string;
  EPC_FLOOR_HEIGHT: number;
  EPC_ADDRESS: string;
  EPC_CONSTRUCTION_AGE_BAND: string;
  EPC_TENURE: string;
  EPC_UPRN: number;
  CPO_BOROUGH: string;
  CPO_WARD: string;
  CPO_OA: string;
  CPO_MSOA: string;
  CPO_LSOA: string;
  UPRN_LATITUDE: number;
  UPRN_LONGITUDE: number;
  EPC_ENERGY_CONSUMPTION_CURRENT_PER_SQM: number;
  EPC_CO2_EMISSIONS_CURRENT_PER_SQM: number;
  EPC_FIRST_INSPECTION_DATE: number;
};

export type AreaAttribute = {
  NPT_NearbyBusStops: number;
  NPT_NearbyTramMetroStops: number;
  NPT_NearbyRailStops: number;
  NPT_NearbyStops: number;
  SCH_NearbyAcademies: number;
  SCH_NearbyIndependentSchools: number;
  SCH_NearbyNurserySchools: number;
  SCH_NearbyPrimarySchools: number;
  SCH_NearbySecondarySchools: number;
  SCH_NearbyOutstandingSchools: number;
  SCH_NearbyGoodSchools: number;
  SCH_NearbyInadequateSchools: number;
  SCH_NearbySchools: number;
  PGN_MSOAName: string;
  PGN_HouseWithPOS: number;
  PGN_HouseTotalPOS: number;
  PGN_HouseWithPOSPct: number;
  PGN_HouseAvgPOS: number;
  PGN_HouseMedPOS: number;
  PGN_FlatWithPOS: number;
  PGN_FlatTotalPOS: number;
  PGN_FlatPOSCount: number;
  PGN_FlatWithPOSPct: number;
  PGN_FlatAvgPOS: number;
  PGN_FlatPOSShare: number;
  PGN_LSOAName: string;
  PGN_NearestParkDistanceAvg: number;
  PGN_NearestParkSizeAvg: number;
  PGN_1kParkCountAvg: number;
  PGN_1kParkSizeAvg: number;
  IMD_LSOAName: string;
  IMD_IMDDecile: number;
  IMD_IncDecile: number;
  IMD_EmpDecile: number;
  IMD_EduDecile: number;
  IMD_CrmDecile: number;
  IMD_HouseBarDecile: number;
  IMD_EnvDecile: number;
};
