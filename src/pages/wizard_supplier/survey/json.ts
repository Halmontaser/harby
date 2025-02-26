export const json = {
  "title": {
    "en": "Supplier Portal Pre-Registration Survey",
    "ar": "استبيان التسجيل المسبق في بوابة الموردين"
  },
  "description": {
    "en": "Please complete this survey to register as a supplier and gain access to our portal.",
    "ar": "يرجى تعبئة هذا الاستبيان للتسجيل كمورد والوصول إلى بوابتنا."
  },
  "pages": [
    {
      "name": "company-info",
      "title": {
        "en": "Company & Contact Information",
        "ar": "معلومات الشركة والاتصال"
      },
      "elements": [
        {
          "type": "text",
          "name": "companyLegalName",
          "title": {
            "en": "Legal Company Name",
            "ar": "الاسم القانوني للشركة"
          },
          "isRequired": true
        },
        {
          "type": "text",
          "name": "registeredAddress",
          "title": {
            "en": "Registered Address",
            "ar": "العنوان المسجل"
          },
          "isRequired": true
        },
        {
          "type": "text",
          "name": "taxNumber",
          "title": {
            "en": "Tax/VAT Number",
            "ar": "رقم الضريبة / القيمة المضافة"
          },
          "isRequired": true
        },
        {
          "type": "text",
          "name": "primaryContact",
          "title": {
            "en": "Primary Contact (Name, Email, Phone)",
            "ar": "جهة الاتصال الرئيسية (الاسم، البريد الإلكتروني، الهاتف)"
          },
          "isRequired": true
        },
        {
          "type": "checkbox",
          "name": "businessClassification",
          "title": {
            "en": "Business Classification",
            "ar": "تصنيف الأعمال"
          },
          "choices": [
            {
              "value": "minority",
              "text": {
                "en": "Minority-Owned",
                "ar": "مملوكة من أقلية"
              }
            },
            {
              "value": "women",
              "text": {
                "en": "Women-Owned",
                "ar": "مملوكة من نساء"
              }
            },
            {
              "value": "veteran",
              "text": {
                "en": "Veteran-Owned",
                "ar": "مملوكة من قدامى المحاربين"
              }
            }
          ],
          "showOtherItem": true
        },
        {
          "type": "file",
          "name": "certifications",
          "title": {
            "en": "Upload Certification Documents",
            "ar": "تحميل وثائق الاعتماد"
          },
          "acceptedTypes": ".pdf,.doc,.docx"
        }
      ]
    },
    {
      "name": "portal-access",
      "title": {
        "en": "Portal Access & Technical Requirements",
        "ar": "متطلبات الوصول الفني إلى البوابة"
      },
      "elements": [
        {
          "type": "boolean",
          "name": "dedicatedTeam",
          "title": {
            "en": "Do you have a dedicated team to manage portal interactions?",
            "ar": "هل لديك فريق مخصص لإدارة التفاعلات عبر البوابة؟"
          },
          "isRequired": true
        },
        {
          "type": "checkbox",
          "name": "systemCompatibility",
          "title": {
            "en": "Are your systems compatible with our portal's requirements?",
            "ar": "هل أنظمتك متوافقة مع متطلبات بوابتنا؟"
          },
          "isRequired": true,
          "choices": [
            {
              "value": "browser",
              "text": {
                "en": "Latest browser versions (Chrome, Firefox)",
                "ar": "أحدث إصدارات المتصفحات (Chrome, Firefox)"
              }
            },
            {
              "value": "formats",
              "text": {
                "en": "PDF/Excel file formats",
                "ar": "صيغ ملفات PDF/Excel"
              }
            },
            {
              "value": "integration",
              "text": {
                "en": "API/EDI integration",
                "ar": "التكامل مع API/EDI"
              }
            }
          ]
        },
        {
          "type": "boolean",
          "name": "acceptElectronicPO",
          "title": {
            "en": "Can you accept electronic purchase orders (POs)?",
            "ar": "هل يمكنك قبول أوامر الشراء الإلكترونية (POs)؟"
          },
          "isRequired": true
        }
      ]
    },
    {
      "name": "compliance",
      "title": {
        "en": "Compliance & Documentation",
        "ar": "الامتثال والوثائق"
      },
      "elements": [
        {
          "type": "boolean",
          "name": "agreeToCodeOfConduct",
          "title": {
            "en": "Have you read and agreed to our Supplier Code of Conduct?",
            "ar": "هل قرأت ووافقت على مدونة قواعد السلوك للموردين؟"
          },
          "isRequired": true
        },
        {
          "type": "file",
          "name": "insuranceCertificates",
          "visibleIf": "{agreeToCodeOfConduct} = true",
          "title": {
            "en": "Upload Insurance Certificates",
            "ar": "تحميل شهادات التأمين"
          }
        },
        {
          "type": "checkbox",
          "name": "cybersecurityCompliance",
          "title": {
            "en": "Cybersecurity Standards Compliance",
            "ar": "الامتثال لمعايير الأمن السيبراني"
          },
          "choices": [
            {
              "value": "gdpr",
              "text": {
                "en": "GDPR",
                "ar": "GDPR"
              }
            },
            {
              "value": "iso27001",
              "text": {
                "en": "ISO 27001",
                "ar": "ISO 27001"
              }
            },
            {
              "value": "soc2",
              "text": {
                "en": "SOC 2",
                "ar": "SOC 2"
              }
            }
          ]
        }
      ]
    },
    {
      "name": "product-service",
      "title": {
        "en": "Product/Service Details",
        "ar": "تفاصيل المنتج/الخدمة"
      },
      "elements": [
        {
          "type": "file",
          "name": "productCatalog",
          "title": {
            "en": "Upload Product Catalog/Service List",
            "ar": "تحميل كتالوج المنتجات / قائمة الخدمات"
          },
          "acceptedTypes": ".pdf,.xlsx,.csv"
        },
        {
          "type": "checkbox",
          "name": "productIdentifiers",
          "title": {
            "en": "Do you use standardized identifiers?",
            "ar": "هل تستخدم معرّفات قياسية؟"
          },
          "choices": [
            {
              "value": "upc",
              "text": {
                "en": "UPC",
                "ar": "UPC"
              }
            },
            {
              "value": "sku",
              "text": {
                "en": "SKU",
                "ar": "SKU"
              }
            },
            {
              "value": "unspsc",
              "text": {
                "en": "UNSPSC",
                "ar": "UNSPSC"
              }
            }
          ]
        },
        {
          "type": "boolean",
          "name": "pricingUpdates",
          "title": {
            "en": "Will you update pricing regularly in the portal?",
            "ar": "هل ستقوم بتحديث الأسعار بانتظام في البوابة؟"
          }
        }
      ]
    }
  ],
  "showQuestionNumbers": "onPage",
  "completeText": {
    "en": "Submit",
    "ar": "إرسال"
  }
}