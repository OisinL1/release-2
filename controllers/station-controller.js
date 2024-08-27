import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const stationController = {
    async index(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        const reports = await reportStore.getReportsByStationId(request.params.id); // Get all reports for the station
        const hasReports = reports.length > 0;
      
        let iconCode = "01d"; // Default icon
        let weather = "";
      
        // Check if there are any reports
        if (reports.length > 0) {
          const latestReport = await reportStore.getLatestReport(request.params.id); // Get the latest report from the list
          const weather = await reportStore.getWeather(latestReport.code.toString());
          const iconCode = await reportStore.getIconCode(latestReport.code.toString());
          
          // Compute max/min reports or other required data
          const maxTempReport = await reportStore.getMaxReport(request.params.id, 'temp');
        // console.log("maxTemp Report Logged " ,maxTempReport.report);
          const minTempReport = await reportStore.getMinReport(request.params.id, 'temp');
          const maxWindSpeedReport = await reportStore.getMaxReport(request.params.id, 'wind_speed');
          const minWindSpeedReport = await reportStore.getMinReport(request.params.id, 'wind_speed');
          const maxPressureReport = await reportStore.getMaxReport(request.params.id, 'humidity');
          const minPressureReport = await reportStore.getMinReport(request.params.id, 'humidity');
          
          const viewData = {
            title: "Station",
            latitude: Number(request, response),
            longitude: Number(request, response),
            station: station,
            reports: reports,
            latestReport: latestReport,
            maxTempReport: maxTempReport,
            minTempReport: minTempReport,
            maxWindSpeedReport: maxWindSpeedReport,
            minWindSpeedReport: minWindSpeedReport,
            maxPressureReport: maxPressureReport,
            minPressureReport: minPressureReport,
            iconCode: iconCode,
            weather: weather,
            hasReports: hasReports
          };
      
          response.render("station-view", viewData);
        } else {
          // Handle case where there are no reports
          const viewData = {
            title: "Station",
            latitude: Number(request, response),
            longitude: Number(request, response),
            station: station,
            latestReport: null,
            maxTempReport: null,
            minTempReport: null,
            maxWindSpeedReport: null,
            minWindSpeedReport: null,
            maxPressureReport: null,
            minPressureReport: null,
            iconCode: "01d", // Default icon when no reports are available
            weather: "",
            hasReports: hasReports
          };
      
          response.render("station-view", viewData);
        }
      },

      async addReport(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        const newReport = {
          code: Number(request.body.code),
          temp: Number(request.body.temp),
          wind_speed: Number(request.body.wind_speed),
          pressure: Number(request.body.pressure),
          wind_direction: (request.body.wind_direction)
          
        };
        console.log(`adding report ${newReport.code}`);
        await reportStore.addReport(station._id, newReport);
        response.redirect("/station/" + station._id);
      },

      async deleteReport(request, response) {
        const stationId = request.params.stationid;
        const reportId = request.params.reportid;
        console.log(`Deleting Report ${reportId} from Station ${stationId}`);
        await reportStore.deleteReport(request.params.reportId);
        response.redirect("/station/" + stationId);
      },
    

      
  

};
