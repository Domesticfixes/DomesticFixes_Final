const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: "gmail", // or your preferred email service provider
    auth: {
        user: "domesticfixesie@gmail.com",
        pass: "imgb ueat lzix cteb" // Use an app-specific password if using Gmail
    }
});

// API route to accept the quote and send emails
app.post("/api/accept-quote", (req, res) => {
  const { customerEmail, handymanEmail, handymanName, customerName, customerPhoneNumber, customerAddress, serviceType, quoteAmount } = req.body;

  console.log("Request Body:", req.body);  // Log to check incoming data
  console.log("Customer Email:", customerEmail);  // Verify customer email specifically

  // Mail options for the Customer
  const mailOptionsCustomer = {
      from: "domesticfixesie@gmail.com",
      to: customerEmail,
      subject: "Your Booking with DomesticFixes is Confirmed!",
      text: `Dear ${customerName},

Thank you for choosing DomesticFixes! We are pleased to confirm that your booking has been successfully processed.

Here are the details of your service appointment:

Handyman Details:
Name: ${handymanName}
Contact: ${handymanEmail}

Service Details:
Service Type: ${serviceType}
Quote Amount: €${quoteAmount}

Your Details:
Name: ${customerName}
Contact: ${customerPhoneNumber}
Address: ${customerAddress}

Payment Details:
You have already paid a blocking fee of €20. The remaining amount (€${quoteAmount - 20}) should be paid directly to the handyman upon successful completion of the service.


We recommend reaching out to your assigned handyman directly if you have specific requests or need to provide additional information. Your handyman will be well-prepared to meet your requirements on the scheduled day.

Should you have any questions or if there’s anything further we can assist you with, please don't hesitate to contact us at domesticfixesie@gmail.com

We appreciate your trust in DomesticFixes and look forward to providing you with outstanding service!

Warm regards,  
The DomesticFixes Team  
 `
  };

  // Mail options for the Handyman
const mailOptionsHandyman = {
    from: "domesticfixesie@gmail.com",
    to: handymanEmail,
    subject: "New Service Request Confirmed!",
    text: `Dear ${handymanName},

We’re pleased to inform you that your quote for €${quoteAmount} has been accepted by the customer. Here are the details of the service request:

Customer Details:
Name: ${customerName}
Contact: ${customerPhoneNumber}

Service Details:
Service Type: ${serviceType}
Balance Due: €${quoteAmount - 20}

Important Note:
A blocking fee of €20 has been deducted from your quote as per company policy. You will receive €${quoteAmount - 20} upon successful completion of the service.

Please make the necessary arrangements and prepare to provide exceptional service to our valued customer. If you have any questions or require further details, feel free to contact us.

Thank you for being a trusted partner with DomesticFixes. We value your professionalism and commitment to excellent service.

Best regards,  
The DomesticFixes Team  
`
};


  // Send both emails
  Promise.all([
      transporter.sendMail(mailOptionsCustomer),
      transporter.sendMail(mailOptionsHandyman)
  ])
  .then(() => {
      console.log("Emails sent successfully.");
      res.status(200).send("Emails sent successfully.");
  })
  .catch((error) => {
      console.error("Error sending emails:", error);
      res.status(500).send("Error sending emails.");
  });
});

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
