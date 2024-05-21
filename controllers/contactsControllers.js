import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/contacts.js";
import { isValidObjectId } from "mongoose";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    return res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: `${id} is not valid id` });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: `${id} is not valid id` });
    }

    const removeContact = await Contact.findByIdAndDelete(id);

    if (!removeContact) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(removeContact);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const newContact = await Contact.create(contact);
    return res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: `${id} is not valid id` });
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: `${id} is not valid id` });
    }

    const updateStatusContact = await Contact.findByIdAndUpdate(
      id,
      { favorite: req.body.favorite },
      {
        new: true,
      }
    );

    if (!updateStatusContact) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(updateStatusContact);
  } catch (err) {
    next(err);
  }
};
