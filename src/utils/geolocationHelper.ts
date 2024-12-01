import axios from "axios";
import { IGeolocationDataDTO } from "../database/DTO/iGeolocationDataDTO";

export default class GeolocationHelper {


    static async getGeolocationData(ipAddress: string): Promise<IGeolocationDataDTO | null> {
        try {
            console.log(`[+] Getting geolocation data for IP: ${ipAddress}`);
            
            const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            const data= response.data;
            if (data.status !== "success") return null;
            const locationData = {
                country: data.country,
                region: data.regionName,
                city: data.city,
                countryCode: data.countryCode,
                timezone: data.timezone,
                ipAddress
            }
            return locationData;
        } catch (error: any) {
            console.error("Error fetching geolocation data:", error);
            return null;
        }
    }



    static extractIpAddress(req: any) {
        const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const firstIp = rawIp.split(',')[0].trim();
        const ipAddress = firstIp.startsWith('::ffff:') ? firstIp.split(':').pop() : firstIp;
        console.log("IP address:", ipAddress);
        return ipAddress;
    }

}