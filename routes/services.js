const express = require("express");
const { Service, RequestService } = require("../mongodb/Service");

const router = express.Router();

// Function to find time slot based on request date and time
const findTimeSlot = (serviceData, requestDate, requestTime) => {
  console.log(serviceData, requestDate, requestTime);
  const timeSlot = serviceData.serviceSlots.find(
    (slot) => slot.date === requestDate
  );

  if (timeSlot) {
    return timeSlot.time.find((time) => time.time === requestTime);
  }

  return null;
};

router.get("/", async (req, res) => {
  try {
    const { serviceName, houseId } = req.query;

    let query = {};

    if (serviceName && houseId) {
      query = { serviceName, Houseid: houseId };
    } else if (houseId) {
      query = { Houseid: houseId };
    } else {
      return res.status(400).json({
        error: "Please provide serviceName or houseId in the query parameters.",
      });
    }

    const services = await Service.find(query);

    if (services.length === 0) {
      return res
        .status(404)
        .json({ message: "No services found in your location." });
    }

    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/cancelRequestService/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;

  try {
    // Find the requested service by ID
    const requestedService = await RequestService.findById(serviceId);

    if (!requestedService) {
      return res.status(404).json({ message: "Requested service not found" });
    }

    // Check if the service is cancellable (based on your business logic)

    // Update the status to "cancelled"
    requestedService.status = "cancelled";
    await requestedService.save();

    res.json({ message: "Requested service cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling requested service:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/requestedServices/:userId", async (req, res) => {
  const userId = req.params.userId;

  const { page = 1, limit = 10 } = req.query;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { created: -1 },
    };

    const requestedServices = await RequestService.paginate(
      { userId },
      options
    );
    res.json(requestedServices);
  } catch (error) {
    console.error("Error fetching requested services:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/requestedService/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;
  console.log(serviceId);

  try {
    const requestedService = await RequestService.findById(serviceId);

    if (!requestedService) {
      return res.status(404).json({ message: "Requested service not found" });
    }

    res.json(requestedService);
  } catch (error) {
    console.error("Error fetching requested service:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/createRequestService", async (req, res) => {
  try {
    const { houseId, userId, service, requestDate, requestTime } = req.body;
    console.log(req.body);

    // Create a new RequestService document
    const newRequestService = new RequestService({
      Houseid: houseId,
      userId,
      service,
      requestDate,
      requestTime: requestTime.time,
    });

    // Save the RequestService document to the database

    // Update vacancy of the corresponding time slot
    const serviceData = await Service.findOne({
      Houseid: "1",
      serviceName: service,
      "serviceSlots.date": "2023-11-14T12:56:51.318Z",
      "serviceSlots.time.time": requestTime.time,
    });
    console.log(serviceData);

    if (serviceData) {
      const timeSlot = findTimeSlot(serviceData, requestDate, requestTime.time);

      if (timeSlot) {
        console.log(timeSlot);

        if (timeSlot.vacancy > 0) {
          timeSlot.vacancy -= 1;
          await newRequestService.save();
          await serviceData.save();

          res
            .status(200)
            .json({ message: "Request Service created successfully" });
        } else {
          console.error("404");
          res.status(400).json({ message: "Time slot is fully booked" });
        }
      } else {
        console.error("404");
        res.status(404).json({ message: "Time slot not found" });
      }
    } else {
      console.error("404");
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
