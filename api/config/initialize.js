/**
 * Initialize.js
 *
 * @author :: Philleep Florence
 * @description :: Holds Initialization Configuration.
 * @directory :: api/config
 */

module.exports = {
	"process": true,
	"server": [
		"administrators",
		"configuration",
		"notifications",
		"privileges",
		"templates"
	],
	"tables": {
		"albums": {
			"table": "app_albums",
			"params": {
				"columns": [
					"id", 
					"name", 
					"title", 
					"headline", 
					"description", 
					"page", 
					"sort_media", 
					"image.name", 
					"image.width", 
					"image.height", 
					"media.id", 
					"media.name", 
					"media.title", 
					"media.caption", 
					"media.width", 
					"media.height", 
					"media.type"
				].join(",")
			},
			"compile": {
				"rows": "data",
				"key": {
					"name": "name"
				},
				"value": {
					"image": "image.data",
					"media": "media.data",
					"page": "page.data.slug"
				}
			}
		},
		"colors": {
			"table": "app_colors",
			"params": {
				"columns": [
					"id", 
					"name", 
					"color", 
					"text_color", 
					"gradient_color"
				].join(",")
			},
			"compile": {
				"rows": "data",
				"key": {
					"name": "name"
				}
			}
		},
		"configuration": {
			"table": "app_configuration",
			"params": {
				"filters": {
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"section": "section",
					"key": "key"
				},
				"values": "value",
				"filters": {
					"config": {
						"name": "config",
						"filter": {
							"public": 1
						}
					}
				}
			}
		},
		"icons": {
			"table": "contents_icons",
			"params": {
				"columns": [
					"id", 
					"path", 
					"url", 
					"description",
					"icon.id", 
					"icon.icon", 
					"icon.css_entity", 
					"icon.class", 
					"analytics.data"
				].join(","),
				"filters": {
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"path": "path"
				},
				"value": {
					"color": "icon.data.color",
					"icon": "icon.data",
					"analytics": "analytics.data"
				}
			}
		},
		"dropdowns": {
			"table": "app_dropdowns",
			"params": {
				"columns": "id,name,value,text,title,description,slug",
				"filters": {
					"application": "app"
				},
				"order": {
					"sort": "ASC"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"name": "name",
					"slug": "slug"
				},
				"value": {
					"page": "page.data.name"
				}
			}
		},
		"labels": {
			"table": "app_labels",
			"params": {
				"columns": [
					"id", 
					"name", 
					"slug", 
					"value", 
					"section", 
					"category", 
					"privilege",
					"image.name", 
					"image.width", 
					"image.height",  
					"icon",
					"page", 
					"analytics.data", 
					"plaintext", 
					"textarea", 
					"input_type", 
					"form_type", 
					"validation", 
					"attributes", 
					"source", 
					"format", 
					"url", 
					"color", 
					"show_html", 
					"hint", 
					"inputs", 
					"property"
				].join(","),
				"limit": -1,
				"filters": {
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"image": "image.data",
					"page": "page.data.slug",
					"section": "section",
					"category": "category",
					"slug": "slug"
				},
				"value": {
					"analytics": "analytics.data",
					"plaintext": "value",
					"textarea": "value",
					"icon": "icon.data",
					"image": "image.data",
					"color": "color.data.color",
					"page": "page.data.name",
					"privilege": "privilege.data.privilege"
				},
				"format": {
					"inputs": "json",
					"plaintext": "plaintext",
					"textarea": "textarea"
				}
			}
		},
		"navigation": {
			"table": "app_navigation",
			"params": {
				"depth": 2,
				"filters": {
					"application": "app"
				},
				"order": {
					"sort": "ASC"
				}
			},
			"compile": {
				"rows": "data",
				"value": {
					"parent": "parent.data.slug",
					"child_page": "child_page.data.slug",
					"color": "color.data.color",
					"pageColor": "page.data.color.data.color",
					"icon": "icon.data",
					"pageicon": "page.data.icon.data",
					"path": "page.data.path",
					"description": "page.data.description",
					"headline": "page.data.headline",
					"privilege": "page.privilege",
					"pagePrivilege": "page.data.privilege.data.privilege",
					"page": "page.data.slug",
					"analytics": "analytics.data"
				}
			}
		},
		"notifications": {
			"table": "app_notifications",
			"params": {
				"depth": 1,
				"filters": {
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"slug": "slug"
				},
				"value": {
					"template": "template.data",
					"privilege": "privilege.data",
					"users": "users.data"
				}
			}
		},
		"pages": {
			"table": "app_pages",
			"params": {
				"columns": [
					"id", 
					"privilege", 
					"level", 
					"name", 
					"slug", 
					"icon", 
					"color", 
					"path",
					"title",
					"description",
					"headline",
					"synopsis",
					"contents",
					"mode",
					"tags",
					"categories",
					"image.name", 
					"image.width", 
					"image.height", 
					"image.type",
					"style",
					"script",
					"page_views"
				].join(","),
				"filters": {
					"application": "app"
				},
				"order": {
					"sort": "ASC"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"slug": "slug"
				},
				"value": {
					"color": "color.data.color",
					"mode": "color.data.name",
					"icon": "icon.data",
					"image": "image.data",
					"tags": "tags.data",
					"labels": "labels.meta.Published",
					"parent": "parent.data.slug",
					"privilege": "privilege.data.privilege"
				},
				"pluck": [{
					"property": "categories",
					"array": "tags",
					"key": "path"
				}]
			}
		},
		"privileges": {
			"table": "app_privileges",
			"params": {
				"filters": {
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"id": "id"
				}
			}
		},
		"redirects": {
			"table": "app_redirects",
			"params": {
				"filters": {
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"type": "type",
					"name": "name"
				},
				"values": {
					"url": "url"
				}
			}
		},
		"tags": {
			"table": "app_tags",
			"params": {
				"limit": -1,
				"depth": 2
			},
			"compile": {
				"rows": "data",
				"key": {
					"id": "id"
				},
				"value": {
					"parent": "parent.data.id"
				}
			}
		},
		"templates": {
			"table": "app_templates",
			"params": {
				"filters": {
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"name": "name"
				},
				"value": {
					"layout": "layout.data.name",
					"icon": "icon.data",
					"parent": "parent.data.slug",
					"analytics": "analytics.data"
				},
				"filters": {
					"errors": {
						"name": "errors",
						"filter": {
							"type": "error"
						}
					}
				}
			}
		},
		"tours": {
			"table": "app_tours",
			"params": {
				"filters": {
					"application": "app"
				},
				"order": {
					"sort": "ASC"
				}
			},
			"compile": {
				"rows": "data",
				"value": {
					"page": "page.data.path",
					"slug": "page.data.slug",
					"icon": "icon.data.icon"
				},
				"filters": {
					"config": {
						"name": "config.tour.steps",
						"key": {
							"id": "id"
						}
					}
				}
			}
		}
	}
}