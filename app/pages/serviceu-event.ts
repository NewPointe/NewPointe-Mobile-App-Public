export class ServiceUEvent {
  constructor(
  public ContactEmail: string, 
  public ContactName: string, 
  public ContactPhone: string, 
  public Description: string, 
  public EventId: number, 
  public ExternalEventUrl: string, 
  public LocationAddress: string, 
  public LocationCity: string,
  public LocationName: string, 
  public LocationState: string, 
  public LocationZip: string,
  public Name: string, 
  public OccurrenceEndTime: string,  /////
  public OccurrenceStartTime: string,
  public PublicEventUrl: string,
  public RegistrationEnabled: number,
  public RegistrationUrl: string
   ) {}
}