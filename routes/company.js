var express = require("express");
var router = express.Router();
var Company = require("../modules/companyModule");

//~--------------------* CREATE COMPANY DATA *--------------------~//

router.post("/register", Company.CompanyRegister);

//~------------------------* GET COMPANY DATA *------------------------~//

router.get("/getcompany", Company.getCompany);

//~------------------------* GET COMPANY DATA BY ID *------------------------~//

router.get("/getcompany/:companyId", Company.getCompanyById);

//~------------------------* UPDATE COMPANY DATA *------------------------~//

router.patch("/updatecompany/:companyId", Company.updateCompany);

//~------------------------* DELETE COMPANY DATA BY ID *------------------------~//

router.delete("/deletecompany/:companyId", Company.deleteCompany);

//~------------------------* ADD CONTACT DATA *------------------------~//

router.put("/addcontact/:companyId", Company.AddContact);

//~------------------------* UPDATE CONTACT DATA *------------------------~//

router.patch("/updatecontact/:companyId", Company.UpdateContact);

//~------------------------* DELETE CONTACT DATA *------------------------~//

router.put("/deletecontact/:companyId", Company.DeleteContact);

//~------------------------* ADD ADDRESS DATA *------------------------~//

router.put("/addaddress/:companyId", Company.AddAddress);

//~------------------------* UPDATE CONTACT DATA *------------------------~//

router.patch("/updateaddress/:companyId", Company.UpdateAddress);

//~------------------------* DELETE ADDRESS DATA *------------------------~//

router.put("/deleteaddress/:companyId", Company.DeleteAddress);

module.exports = router;
