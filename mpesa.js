const simulatePayment = (phone, amount) => {
  return new Promise((resolve)=>{
    console.log("Processing MPESA payment...");

    setTimeout(()=>{
      resolve({
        success: true,
        message: "Payment successful"
      });
    },3000);
  });
};

module.exports = { simulatePayment };
