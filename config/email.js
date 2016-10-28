module.exports.email = {
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  alwaysSendTo: 'jason.goetz@gmail.com',
  from: 'Fake Stacks \<info@fakestacks.com\>',
  testMode: false
}
