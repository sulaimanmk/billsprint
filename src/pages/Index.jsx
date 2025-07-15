import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import FloatingLabelInput from '../components/FloatingLabelInput';
import BillToSection from '../components/BillToSection';
import ShipToSection from '../components/ShipToSection';
import ItemDetails from "../components/ItemDetails";
import LogoUpload from "../components/LogoUpload";
import ItemSuggestions from "../components/ItemSuggestions";
import TemplateRecommendations from "../components/TemplateRecommendations";
import RecurringTemplates from "../components/RecurringTemplates";
import { templates } from "../utils/templateRegistry";
import { FiEdit, FiFileText, FiTrash2 } from "react-icons/fi";
import { RefreshCw, Brain, Zap } from "lucide-react";
import { useItemSuggestions } from "../hooks/useItemSuggestions";
import { useTemplateRecommendations } from "../hooks/useTemplateRecommendations";
import { useRecurringTemplates } from "../hooks/useRecurringTemplates";
import { calculateSmartTax } from "../utils/smartTaxCalculator";

const generateRandomInvoiceNumber = () => {
  const length = Math.floor(Math.random() * 6) + 3;
  const alphabetCount = Math.min(Math.floor(Math.random() * 4), length);
  let result = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  for (let i = 0; i < alphabetCount; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  for (let i = alphabetCount; i < length; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return result;
};

const noteOptions = [
  "Thank you for choosing us today! We hope your shopping experience was pleasant and seamless. Your satisfaction matters to us, and we look forward to serving you again soon. Keep this receipt for any returns or exchanges.",
  "Your purchase supports our community! We believe in giving back and working towards a better future. Thank you for being a part of our journey. We appreciate your trust and hope to see you again soon.",
  "We value your feedback! Help us improve by sharing your thoughts on the text message survey link. Your opinions help us serve you better and improve your shopping experience. Thank you for shopping with us!",
  "Did you know you can save more with our loyalty program? Ask about it on your next visit and earn points on every purchase. It’s our way of saying thank you for being a loyal customer. See you next time!",
  "Need assistance with your purchase? We’re here to help! Reach out to our customer support, or visit our website for more information. We’re committed to providing you with the best service possible.",
  "Keep this receipt for returns or exchanges.",
  "Every purchase makes a difference! We are dedicated to eco-friendly practices and sustainability. Thank you for supporting a greener planet with us. Together, we can build a better tomorrow.",
  "Have a great day!",
  "“Thank you for shopping with us today. Did you know you can return or exchange your items within 30 days with this receipt? We want to ensure that you’re happy with your purchase, so don’t hesitate to come back if you need assistance.",
  "Eco-friendly business. This receipt is recyclable.",
  "We hope you enjoyed your shopping experience! Remember, for every friend you refer, you can earn exclusive rewards. Visit www.example.com/refer for more details. We look forward to welcoming you back soon!",
  "Thank you for choosing us! We appreciate your business and look forward to serving you again. Keep this receipt for any future inquiries or returns.",
  "Your purchase supports local businesses and helps us continue our mission. Thank you for being a valued customer. We hope to see you again soon!",
  "We hope you had a great shopping experience today. If you have any feedback, please share it with us on our website. We are always here to assist you.",
  "Thank you for your visit! Remember, we offer exclusive discounts to returning customers. Check your email for special offers on your next purchase.",
  "Your satisfaction is our top priority. If you need any help or have questions about your purchase, don’t hesitate to contact us. Have a great day!",
  "We love our customers! Thank you for supporting our business. Follow us on social media for updates on promotions and new products. See you next time!",
  "Every purchase counts! We are committed to making a positive impact, and your support helps us achieve our goals. Thank you for shopping with us today!",
  "We hope you found everything you needed. If not, please let us know so we can improve your experience. Your feedback helps us serve you better. Thank you!",
  "Thank you for visiting! Did you know you can save more with our rewards program? Ask about it during your next visit and start earning points today!",
  "We appreciate your trust in us. If you ever need assistance with your order, please visit our website or call customer service. We’re here to help!",
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState("GBP");
  const [billTo, setBillTo] = useState({ name: "", address: "", phone: "" });
  const [shipTo, setShipTo] = useState({ name: "", address: "", phone: "" });
  const [invoice, setInvoice] = useState({
    date: "",
    paymentDate: "",
    number: "",
  });
  const [yourCompany, setYourCompany] = useState({
    name: "",
    address: "",
    phone: "",
    logo: "",
  });
  const [items, setItems] = useState([]);
  const [taxPercentage, settaxPercentage] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [notes, setNotes] = useState("");
  const [smartTaxEnabled, setSmartTaxEnabled] = useState(false);

  // Smart features hooks
  const { suggestions, isLoading: suggestionsLoading, generateSuggestions } = useItemSuggestions(yourCompany.name, items);
  const recommendedTemplates = useTemplateRecommendations(yourCompany.name, items);
  const { savedTemplates, saveTemplate, loadTemplate, deleteTemplate } = useRecurringTemplates();

  const refreshNotes = () => {
    const randomIndex = Math.floor(Math.random() * noteOptions.length);
    setNotes(noteOptions[randomIndex]);
  };

  useEffect(() => {
    // Load form data from localStorage on component mount
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setBillTo(parsedData.billTo || { name: "", address: "", phone: "" });
      setShipTo(parsedData.shipTo || { name: "", address: "", phone: "" });
      setInvoice(
        parsedData.invoice || { date: "", paymentDate: "", number: "" }
      );
      setYourCompany(
        parsedData.yourCompany || { name: "", address: "", phone: "", logo: "" }
      );
      setItems(parsedData.items || []);
      settaxPercentage(parsedData.taxPercentage || 0);
      setNotes(parsedData.notes || "");
      setSelectedCurrency(parsedData.selectedCurrency || "GBP"); // Load selectedCurrency from localStorage
    } else {
      // If no saved data, set invoice number
      setInvoice((prev) => ({
        ...prev,
        number: generateRandomInvoiceNumber(),
      }));
    }
  }, []);

  useEffect(() => {
    // Generate suggestions when company name changes
    if (yourCompany.name.trim()) {
      generateSuggestions(yourCompany.name);
    }
  }, [yourCompany.name]);

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    const formData = {
      billTo,
      shipTo,
      invoice,
      yourCompany,
      items,
      taxPercentage,
      taxAmount,
      subTotal,
      grandTotal,
      notes,
      selectedCurrency, // Add selectedCurrency to localStorage
    };
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [
    billTo,
    shipTo,
    invoice,
    yourCompany,
    items,
    taxPercentage,
    notes,
    taxAmount,
    subTotal,
    grandTotal,
    selectedCurrency, // Add selectedCurrency to localStorage dependency array
  ]);

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (logoData) => {
    setYourCompany(prev => ({ ...prev, logo: logoData }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "quantity" || field === "amount") {
      newItems[index].total = newItems[index].quantity * newItems[index].amount;
    }
    setItems(newItems);
    updateTotals();
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", description: "", quantity: 0, amount: 0, total: 0 },
    ]);
  };

  const addSuggestedItem = (suggestion) => {
    setItems([
      ...items,
      { 
        name: suggestion.name, 
        description: suggestion.description, 
        quantity: 1, 
        amount: suggestion.amount, 
        total: suggestion.amount 
      },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateSubTotal = () => {
    const calculatedSubTotal = items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    setSubTotal(calculatedSubTotal); // Store as number
    return calculatedSubTotal;
  };

  const calculateTaxAmount = (subTotalValue) => { // Renamed param to avoid conflict with state
    const tax = (subTotalValue * taxPercentage) / 100;
    setTaxAmount(tax); // Store as number
    return tax;
  };

  const calculateGrandTotal = (subTotalValue, taxAmountValue) => { // Renamed params to avoid conflict with state
    const total = parseFloat(subTotalValue) + parseFloat(taxAmountValue);
    setGrandTotal(total); // Store as number
    return total;
  };

  const updateTotals = () => {
    const currentSubTotal = calculateSubTotal();
    const currentTaxAmount = calculateTaxAmount(currentSubTotal);
    // setGrandTotal will be called by calculateGrandTotal via currentTaxAmount's setter,
    // or directly if we prefer explicit calls.
    // For clarity and directness, let's call it explicitly here.
    calculateGrandTotal(currentSubTotal, currentTaxAmount);
    // Note: setSubTotal and setTaxAmount are called within their respective calculate functions.
  };

  const handleTaxPercentageChange = (e) => {
    const taxRate = parseFloat(e.target.value) || 0;
    settaxPercentage(taxRate);
    setSmartTaxEnabled(false); // Disable smart tax when manually changed
  };

  const enableSmartTax = () => {
    const currentSubTotal = calculateSubTotal();
    const smartTax = calculateSmartTax(billTo.address, yourCompany.name, currentSubTotal);
    settaxPercentage(smartTax.rate);
    setSmartTaxEnabled(true);
  };

  useEffect(() => {
    updateTotals();
  }, [items, taxPercentage]); // subTotal, taxAmount, grandTotal removed from deps as they are set by updateTotals & its chain

  const handleTemplateClick = (templateNumber) => {
    const formData = {
      billTo,
      shipTo,
      invoice,
      yourCompany,
      items,
      taxPercentage,
      taxAmount,
      subTotal,
      grandTotal,
      notes,
      selectedCurrency, // Add this
    };
    navigate("/template", {
      state: { formData, selectedTemplate: templateNumber },
    });
  };

  const handleRecurringTemplateLoad = (templateId) => {
    const templateData = loadTemplate(templateId);
    if (templateData) {
      setBillTo(templateData.billTo || { name: "", address: "", phone: "" });
      setShipTo(templateData.shipTo || { name: "", address: "", phone: "" });
      setInvoice(templateData.invoice || { date: "", paymentDate: "", number: generateRandomInvoiceNumber() });
      setYourCompany(templateData.yourCompany || { name: "", address: "", phone: "", logo: "" });
      setItems(templateData.items || []);
      settaxPercentage(templateData.taxPercentage || 0);
      setNotes(templateData.notes || "");
      setSelectedCurrency(templateData.selectedCurrency || "GBP");
    }
  };

  const fillDummyData = () => {
    setBillTo({
      name: "John Doe",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
    });
    setShipTo({
      name: "Jane Smith",
      address: "456 Elm St, Othertown, USA",
      phone: "(555) 987-6543",
    });
    setInvoice({
      date: new Date().toISOString().split("T")[0],
      paymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      number: generateRandomInvoiceNumber(),
    });
    setYourCompany({
      name: "Your Company",
      address: "789 Oak St, Businessville, USA",
      phone: "(555) 555-5555",
      logo: "", // Add logo field
    });
    setItems([
      {
        name: "Product A",
        description: "High-quality item",
        quantity: 2,
        amount: 50,
        total: 100,
      },
      {
        name: "Service B",
        description: "Professional service",
        quantity: 1,
        amount: 200,
        total: 200,
      },
      {
        name: "Product C",
        description: "Another great product",
        quantity: 3,
        amount: 30,
        total: 90,
      },
      {
        name: "Service D",
        description: "Another professional service",
        quantity: 2,
        amount: 150,
        total: 300,
      },
      {
        name: "Product E",
        description: "Yet another product",
        quantity: 1,
        amount: 75,
        total: 75,
      },
      {
        name: "Service F",
        description: "Yet another service",
        quantity: 4,
        amount: 100,
        total: 400,
      },
    ]);
    settaxPercentage(10);
    calculateSubTotal();
    setNotes("Thank you for your business!");
  };

  const clearForm = () => {
    setBillTo({ name: "", address: "", phone: "" });
    setShipTo({ name: "", address: "", phone: "" });
    setInvoice({
      date: "",
      paymentDate: "",
      number: generateRandomInvoiceNumber(),
    });
    setYourCompany({ name: "", address: "", phone: "" });
    setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
    settaxPercentage(0);
    setNotes("");
    localStorage.removeItem("formData");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Billsprint
        </h1>
        <h3 className="text-4x1 font-light mb-8 text-center">Your no.1 bills and invoice generator</h3>
        
        <div className="fixed top-4 left-4 flex gap-2">
          <button
            onClick={clearForm}
            className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
            aria-label="Clear Form"
          >
            <FiTrash2 size={24} />
          </button>
          <button
            onClick={fillDummyData}
            className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
            aria-label="Fill with Dummy Data"
          >
            <FiEdit size={24} />
          </button>
        </div>
        <button
          onClick={() =>
            navigate("/receipt", {
              state: {
                formData: {
                  billTo,
                  shipTo,
                  invoice,
                  yourCompany,
                  items,
                  taxPercentage,
                  notes,
                  selectedCurrency, // Ensure this is passed
                },
              },
            })
          }
          className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600"
          aria-label="Switch to Receipt"
        >
          <FiFileText size={24} />
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20">
            <form>
              <LogoUpload onLogoChange={handleLogoChange} currentLogo={yourCompany.logo} />
              
              <RecurringTemplates
                savedTemplates={savedTemplates}
                onSaveTemplate={saveTemplate}
                onLoadTemplate={handleRecurringTemplateLoad}
                onDeleteTemplate={deleteTemplate}
                currentFormData={{
                  billTo, shipTo, invoice, yourCompany, items, 
                  taxPercentage, notes, selectedCurrency
                }}
              />
              
              <BillToSection
                billTo={billTo}
                handleInputChange={handleInputChange(setBillTo)}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
              />
              
              <ShipToSection
                shipTo={shipTo}
                handleInputChange={handleInputChange(setShipTo)}
                billTo={billTo}
              />

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Invoice Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingLabelInput
                    id="invoiceNumber"
                    label="Invoice Number"
                    value={invoice.number}
                    onChange={handleInputChange(setInvoice)}
                    name="number"
                  />
                  <FloatingLabelInput
                    id="invoiceDate"
                    label="Invoice Date"
                    type="date"
                    value={invoice.date}
                    onChange={handleInputChange(setInvoice)}
                    name="date"
                  />
                  <FloatingLabelInput
                    id="paymentDate"
                    label="Payment Date"
                    type="date"
                    value={invoice.paymentDate}
                    onChange={handleInputChange(setInvoice)}
                    name="paymentDate"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Your Company</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingLabelInput
                    id="yourCompanyName"
                    label="Name"
                    value={yourCompany.name}
                    onChange={handleInputChange(setYourCompany)}
                    name="name"
                  />
                  <FloatingLabelInput
                    id="yourCompanyPhone"
                    label="Phone"
                    value={yourCompany.phone}
                    onChange={handleInputChange(setYourCompany)}
                    name="phone"
                  />
                </div>
                <FloatingLabelInput
                  id="yourCompanyAddress"
                  label="Address"
                  value={yourCompany.address}
                  onChange={handleInputChange(setYourCompany)}
                  name="address"
                  className="mt-4"
                />
              </div>

              <ItemSuggestions
                suggestions={suggestions}
                isLoading={suggestionsLoading}
                onAddSuggestion={addSuggestedItem}
              />

              <ItemDetails
                items={items}
                handleItemChange={handleItemChange}
                addItem={addItem}
                removeItem={removeItem}
                currencyCode={selectedCurrency}
              />

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Totals</h3>
                <div className="flex justify-between mb-2">
                  <span>Sub Total:</span>
                  <span>{formatCurrency(subTotal, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Tax Rate (%):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={taxPercentage}
                      onChange={handleTaxPercentageChange}
                      className="w-24 p-2 border rounded"
                      min="0"
                      max="50"
                      step="0.1"
                    />
                    <button
                      type="button"
                      onClick={enableSmartTax}
                      className={`p-2 rounded ${smartTaxEnabled ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      title="Smart Tax Calculation"
                    >
                      <Brain className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {smartTaxEnabled && (
                  <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                    <Zap className="inline h-3 w-3 mr-1" />
                    Smart tax calculated based on location
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span>Tax Amount:</span>
                  <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium">Notes</h3>
                  <button
                    type="button"
                    onClick={refreshNotes}
                    className="ml-2 p-1 rounded-full hover:bg-gray-200"
                    title="Refresh Notes"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="4"
                ></textarea>
              </div>

              {/* Clear Form button removed */}
            </form>
          </div>

          <div
            className="w-full md:w-1/2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20"
            // style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Template Gallery</h2>
            
            <TemplateRecommendations
              recommendedTemplates={recommendedTemplates}
              templates={templates}
              onTemplateClick={handleTemplateClick}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <div
                  key={index}
                  className="template-card bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 dark:border-gray-600/20"
                  onClick={() => handleTemplateClick(index + 1)}
                >
                  <img
                    src={`/assets/template${index + 1}-preview.png`}
                    alt={template.name}
                    className={`w-full ${
                      template.name === "Template 10"
                        ? "h-[38px] w-[57px]"
                        : "h-50"
                    } object-cover rounded-lg mb-2`}
                  />
                  <p className="text-center font-medium text-gray-900 dark:text-gray-100">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
