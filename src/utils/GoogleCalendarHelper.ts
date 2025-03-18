// GoogleCalendarHelper.ts
// This file helps with Google Calendar API integration by providing utility functions

/**
 * Handles authentication with Google Calendar API and manages calendar events
 */
export class GoogleCalendarHelper {
  private clientId: string;
  private apiKey?: string;
  private isInitialized: boolean = false;
  private isSignedIn: boolean = false;

  constructor(clientId: string, apiKey?: string) {
    this.clientId = clientId;
    this.apiKey = apiKey;
  }

  /**
   * Initializes the Google Calendar API client
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Make sure gapi is loaded
      if (!window.gapi) {
        console.error('Google API not loaded');
        return false;
      }

      // Load required gapi client libraries
      await new Promise<void>((resolve, reject) => {
        window.gapi.load('client:auth2', {
          callback: () => resolve(),
          onerror: (error: any) => reject(error)
        });
      });

      // Initialize the client
      await window.gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });

      // Listen for sign-in state changes
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus.bind(this));
      
      // Handle initial sign-in state
      this.updateSignInStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing Google Calendar API:', error);
      return false;
    }
  }

  /**
   * Updates the sign-in status
   */
  private updateSignInStatus(isSignedIn: boolean) {
    this.isSignedIn = isSignedIn;
  }

  /**
   * Signs in the user
   */
  async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await window.gapi.auth2.getAuthInstance().signIn();
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  }

  /**
   * Signs out the user
   */
  signOut(): void {
    if (this.isInitialized) {
      window.gapi.auth2.getAuthInstance().signOut();
    }
  }

  /**
   * Checks if user is signed in
   */
  isUserSignedIn(): boolean {
    return this.isSignedIn;
  }

  /**
   * Creates a calendar event
   * @param event The event details to create
   * @returns Promise that resolves with the created event
   */
  async createEvent(event: any): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.isSignedIn) {
      throw new Error('User not signed in');
    }

    try {
      const response = await window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'sendUpdates': 'all',
        'resource': event
      });
      
      return response.result;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Lists events for a specific day
   * @param date The date to get events for
   * @returns Promise that resolves with the events
   */
  async listEvents(date: Date): Promise<any[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.isSignedIn) {
      throw new Error('User not signed in');
    }

    // Create time boundaries for the selected date
    const timeMin = new Date(date);
    timeMin.setHours(0, 0, 0, 0);
    
    const timeMax = new Date(date);
    timeMax.setHours(23, 59, 59, 999);

    try {
      const response = await window.gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': timeMin.toISOString(),
        'timeMax': timeMax.toISOString(),
        'singleEvents': true,
        'orderBy': 'startTime'
      });
      
      return response.result.items || [];
    } catch (error) {
      console.error('Error listing events:', error);
      throw error;
    }
  }

  /**
   * Sets up domain for Google Calendar
   * Instructions to register domain in Google Cloud Console
   */
  static getSetupInstructions(): string {
    return `
To use Google Calendar API on your domain:

1. Go to the Google Cloud Console (https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Under "Authorized JavaScript origins" add your domain:
   - For development: http://localhost:3000 or http://localhost:5173
   - For production: https://yourdomain.com
6. Click "Save"

Changes may take a few minutes to propagate.
`;
  }
}

export default GoogleCalendarHelper;