const Company = require("../model/Company");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

//*-------------------* Adding Company Details *-------------------*//

exports.CompanyRegister = async (req, res, next) => {
  const schema = Joi.object({
    company_name: Joi.string().min(3).max(50).trim(true).required(),
    country: Joi.string().min(3).max(60).trim(true).required(),
    team: Joi.object({
      email: Joi.string()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      contact_title: Joi.string().valid("Mr.", "Mrs.", "Dr.").required(),
      position: Joi.string().valid("Owner", "Manager").required(),
      first_name: Joi.string().min(3).trim(true).required(),
      last_name: Joi.string().min(3).trim(true).required(),
      contact_number: Joi.string().min(10).required(),
      index: Joi.number(),
    }),
    company_notes: Joi.string().min(3).trim(true).required(),
    address: Joi.object({
      address_title: Joi.string().valid("Home", "Office", "Factory").required(),
      line: Joi.string().min(3).trim(true).required(),
      index: Joi.number(),
    }),
    state: Joi.string().min(3).max(18).trim(true).required(),
    city: Joi.string().min(3).max(50).trim(true).required(),
    zip_code: Joi.number().required(),
  });

  var { error } = await schema.validate(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  var existUser = await Company.findOne({
    company_name: req.body.company_name,
  }).exec();
  if (existUser)
    return res
      .status(400)
      .send({ msg: "Company already exists.", status: "error" });

  let Team = [
    {
      contact_title: req.body.team.contact_title,
      contact_number: req.body.team.contact_number,
      email: req.body.team.email.toLowerCase(),
      first_name: req.body.team.first_name,
      last_name: req.body.team.last_name,
      position: req.body.team.position,
      primary: true,
      index: 1,
    },
  ];

  let Address = [
    {
      address_title: req.body.address.address_title,
      line: req.body.address.line,
      primary: true,
      index: 1,
    },
  ];

  const company = new Company({
    company_notes: req.body.company_notes,
    company_name: req.body.company_name,
    zip_code: req.body.zip_code,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    address: Address,
    team: Team,
  });

  try {
    await company.save();
    res
      .status(201)
      .send({ msg: "Company detailes added successfully", status: "success" });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Geting All Company Data *-----------------------*//

exports.getCompany = async (req, res, next) => {
  try {
    let respo = await Company.find();
    res.status(200).send(respo);
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Geting All Company Data by Id *-----------------------*//

exports.getCompanyById = async (req, res, next) => {
  try {
    const post = await Company.findById(req.params.companyId);
    res.status(200).send(post);
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Update Company Data By Id *-----------------------*//

exports.updateCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);

  const data = {
    company_notes: req.body.company_notes || company.company_notes,
    company_name: req.body.company_name || company.company_name,
    zip_code: req.body.zip_code || company.zip_code,
    country: req.body.country || company.country,
    state: req.body.state || company.state,
    city: req.body.city || company.city,
  };

  try {
    await Company.findByIdAndUpdate(req.params.companyId, data, { new: true });
    res.status(200).json({
      msg: "You have successfully updated your account..!",
      status: "success",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Delete Company Data By Id *-----------------------*//

exports.deleteCompany = async (req, res, next) => {
  try {
    await Company.findByIdAndRemove(req.params.companyId);
    res.status(200).json({
      msg: "You have successfully deleted your account..!",
      status: "success",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Add Contact By Id *-----------------------*//

exports.AddContact = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    contact_title: Joi.string().valid("Mr.", "Mrs.", "Dr.").required(),
    first_name: Joi.string().min(3).max(50).trim(true).required(),
    last_name: Joi.string().min(3).max(50).trim(true).required(),
    position: Joi.string().valid("Owner", "Manager").required(),
    primary: Joi.boolean().valid(true, false).required(),
    contact_number: Joi.string().min(10).required(),
  });

  var { error } = await schema.validate(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let Primary;
  let team = await Company.findById(req.params.companyId);
  let data = team.team;
  if (data.length > 0) {
    Primary = req.body.primary;

    for (let i = 0; i < data.length; i++) {
      if (
        data[i].email.toLowerCase() === req.body.email.toLowerCase() &&
        data[i].contact_number === req.body.contact_number &&
        data[i].first_name.toLowerCase() ===
          req.body.first_name.toLowerCase() &&
        data[i].last_name.toLowerCase() === req.body.last_name.toLowerCase()
      )
        return res.status(400).send({ msg: "Contact already exists" });

      if (data[i].email.toLowerCase() === req.body.email.toLowerCase())
        return res.status(400).send({ msg: "Email already exists" });

      if (
        data[i].contact_number.toString() === req.body.contact_number.toString()
      )
        return res.status(400).send({ msg: "Contact Number already exists" });
    }

    if (req.body.primary) {
      let updatedData = [];
      for (let i = 0; i < data.length; i++) {
        let update = {
          contact_number: data[i].contact_number,
          contact_title: data[i].contact_title,
          email: data[i].email.toLowerCase(),
          first_name: data[i].first_name,
          last_name: data[i].last_name,
          position: data[i].position,
          primary: false,
          index: i,
        };
        updatedData.push(update);
      }

      await Company.findByIdAndUpdate(
        req.params.companyId,
        { team: updatedData },
        { new: true }
      );
    }
  } else {
    Primary = true;
  }

  let index = data.length;

  let Team = {
    contact_number: req.body.contact_number,
    contact_title: req.body.contact_title,
    email: req.body.email.toLowerCase(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    position: req.body.position,
    primary: Primary,
    index: index,
  };

  try {
    await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $push: { team: Team },
      },
      { new: true }
    );
    res.status(201).json({ msg: "Contact added successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Update Contact By Id *-----------------------*//

exports.UpdateContact = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    contact_title: Joi.string().valid("Mr.", "Mrs.", "Dr.").required(),
    first_name: Joi.string().min(3).max(50).trim(true).required(),
    last_name: Joi.string().min(3).max(50).trim(true).required(),
    position: Joi.string().valid("Owner", "Manager").required(),
    primary: Joi.boolean().valid(true, false).required(),
    contact_number: Joi.string().min(10).required(),
    index: Joi.number().required(),
    _id: Joi.required(),
  });

  var { error } = await schema.validate(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let updatedData = [];
  let team = await Company.findById(req.params.companyId);
  let data = team.team;

  if (req.body.primary) {
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id == req.body._id) {
        let update = {
          contact_number: req.body.contact_number,
          contact_title: req.body.contact_title,
          email: req.body.email.toLowerCase(),
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          position: req.body.position,
          primary: req.body.primary,
          index: req.body.index,
        };

        updatedData.push(update);
      } else {
        let update = {
          contact_number: data[i].contact_number,
          contact_title: data[i].contact_title,
          email: data[i].email.toLowerCase(),
          first_name: data[i].first_name,
          last_name: data[i].last_name,
          position: data[i].position,
          index: data[i].index,
          primary: false,
        };

        updatedData.push(update);
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        updatedData.push({
          contact_number: data[i].contact_number,
          contact_title: data[i].contact_title,
          email: data[i].email.toLowerCase(),
          first_name: data[i].first_name,
          last_name: data[i].last_name,
          position: data[i].position,
          primary: true,
          index: i,
        });
      } else {
        updatedData.push({
          contact_number: data[i].contact_number,
          contact_title: data[i].contact_title,
          email: data[i].email.toLowerCase(),
          first_name: data[i].first_name,
          last_name: data[i].last_name,
          position: data[i].position,
          primary: false,
          index: i,
        });
      }
    }
  }

  try {
    await Company.findByIdAndUpdate(
      req.params.companyId,
      { team: updatedData },
      { new: true }
    );
    res.status(200).json({ msg: "Contact updated successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Delete Contact By Id *-----------------------*//

exports.DeleteContact = async (req, res, next) => {
  await Company.findByIdAndUpdate(req.params.companyId, {
    $pull: { team: { _id: req.body._id } },
  });

  let updatedData = [];
  let teamFound = await Company.findById(req.params.companyId);
  let data = teamFound.team;

  if (req.body.primary) {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        updatedData.push({
          contact_number: data[i].contact_number,
          contact_title: data[i].contact_title,
          email: data[i].email.toLowerCase(),
          first_name: data[i].first_name,
          last_name: data[i].last_name,
          position: data[i].position,
          primary: true,
          index: i,
        });
      } else {
        updatedData.push({
          contact_number: data[i].contact_number,
          contact_title: data[i].contact_title,
          email: data[i].email.toLowerCase(),
          first_name: data[i].first_name,
          last_name: data[i].last_name,
          position: data[i].position,
          primary: false,
          index: i,
        });
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      updatedData.push({
        contact_number: data[i].contact_number,
        contact_title: data[i].contact_title,
        email: data[i].email.toLowerCase(),
        first_name: data[i].first_name,
        last_name: data[i].last_name,
        position: data[i].position,
        primary: data[i].primary,
        index: i,
      });
    }
  }

  try {
    await Company.findByIdAndUpdate(
      req.params.companyId,
      { team: updatedData },
      { new: true }
    );

    res.status(200).json({ msg: "Contact removed successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Add Address By Id *-----------------------*//

exports.AddAddress = async (req, res, next) => {
  const schema = Joi.object({
    address_title: Joi.string().valid("Home", "Office", "Factory").required(),
    primary: Joi.boolean().valid(true, false).required(),
    line: Joi.string().min(3).trim(true).required(),
  });

  var { error } = await schema.validate(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let Primary;
  let address = await Company.findById(req.params.companyId);
  let data = address.address;

  if (data.length > 0) {
    Primary = req.body.primary;

    for (let i = 0; i < data.length; i++) {
      if (data[i].line.toLowerCase() === req.body.line.toLowerCase())
        return res.status(400).send({ msg: "Address already exists" });
    }

    if (req.body.primary) {
      let updatedData = [];

      for (let i = 0; i < data.length; i++) {
        let update = {
          address_title: data[i].address_title,
          line: data[i].line,
          primary: false,
          index: i,
        };

        updatedData.push(update);
      }

      await Company.findByIdAndUpdate(
        req.params.companyId,
        { address: updatedData },
        { new: true }
      );
    }
  } else {
    Primary = true;
  }

  let index = data.length;

  let Address = {
    address_title: req.body.address_title,
    line: req.body.line,
    primary: Primary,
    index: index,
  };

  try {
    await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $push: { address: Address },
      },
      { new: true }
    );
    res.status(201).json({ msg: "Address added successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Update Address By Id *-----------------------*//

exports.UpdateAddress = async (req, res, next) => {
  const schema = Joi.object({
    address_title: Joi.string().valid("Home", "Office", "Factory").required(),
    primary: Joi.boolean().valid(true, false).required(),
    line: Joi.string().min(3).trim(true).required(),
    index: Joi.number().required(),
    _id: Joi.required(),
  });

  var { error } = await schema.validate(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let updatedData = [];
  let address = await Company.findById(req.params.companyId);
  let data = address.address;

  if (req.body.primary) {
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id == req.body._id) {
        let update = {
          address_title: req.body.address_title,
          index: req.body.index,
          line: req.body.line,
          primary: true,
        };

        updatedData.push(update);
      } else {
        let update = {
          address_title: data[i].address_title,
          index: data[i].index,
          line: data[i].line,
          primary: false,
        };

        updatedData.push(update);
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        updatedData.push({
          address_title: data[i].address_title,
          line: data[i].line,
          primary: true,
          index: i,
        });
      } else {
        updatedData.push({
          index: i,
          address_title: data[i].address_title,
          line: data[i].line,
          primary: false,
        });
      }
    }
  }

  try {
    await Company.findByIdAndUpdate(
      req.params.companyId,
      { address: updatedData },
      { new: true }
    );
    res.status(200).json({ msg: "Address updated successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Delete Address By Id *-----------------------*//

exports.DeleteAddress = async (req, res, next) => {
  await Company.findByIdAndUpdate(
    req.params.companyId,
    {
      $pull: { address: { _id: req.body._id } },
    },
    { new: true }
  );

  let updatedData = [];
  let address = await Company.findById(req.params.companyId);
  let data = address.address;

  if (req.body.primary) {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        updatedData.push({
          address_title: data[i].address_title,
          line: data[i].line,
          primary: true,
          index: i,
        });
      } else {
        updatedData.push({
          address_title: data[i].address_title,
          line: data[i].line,
          primary: false,
          index: i,
        });
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      updatedData.push({
        address_title: data[i].address_title,
        primary: data[i].primary,
        line: data[i].line,
        index: i,
      });
    }
  }

  try {
    await Company.findByIdAndUpdate(
      req.params.companyId,
      { address: updatedData },
      { new: true }
    );

    res.status(200).json({ msg: "Address removed successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
};