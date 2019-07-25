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
		"configuration",
		"administrators"
	],
	"tables": {
		"albums": {
			"table": "app_albums",
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
			"compile": {
				"rows": "data",
				"key": {
					"id": "id"
				},
				"filters": {
					"config": {
						"name": "config.colors",
						"key": {
							"name": "name"
						}
					}
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
					"icon": "icon.data"
				},
				"process": {
					"analytics": "data-toggle=\"analytics\" data-analytics-category=\"{{ analytics.data.category }}\" data-analytics-action=\"{{ analytics.data.action }}\" data-analytics-label=\"{{ analytics.data.label }}\" data-analytics-value=\"{{ analytics.data.value }}\""
				}
			}
		},
		"dropdowns": {
			"table": "app_dropdowns",
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
				"limit": -1,
				"filters": {
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"key": {
					"page": "page.data.slug",
					"section": "section",
					"category": "category",
					"slug": "slug"
				},
				"value": {
					"plaintext": "value",
					"textarea": "value",
					"icon": "icon.data",
					"color": "color.data.color",
					"page": "page.data.name",
					"privilege": "privilege.data.privilege"
				},
				"filters": {
					"config": {
						"name": "config",
						"filter": {
							"public": 1
						},
						"values": "value"
					}
				},
				"format": {
					"inputs": "json",
					"plaintext": "plaintext",
					"textarea": "textarea"
				},
				"process": {
					"analytics": "data-toggle=\"analytics\" data-analytics-category=\"{{ analytics.data.category }}\" data-analytics-action=\"{{ analytics.data.action }}\" data-analytics-label=\"{{ analytics.data.label }}\" data-analytics-value=\"{{ analytics.data.value }}\""
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
				}],
				"process": {
					"analytics": "data-toggle=\"analytics\" data-analytics-category=\"{{ analytics.data.category }}\" data-analytics-action=\"{{ analytics.data.action }}\" data-analytics-label=\"{{ analytics.data.label }}\" data-analytics-value=\"{{ analytics.data.value }}\""
				}
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
					"parent": "parent.data",
					"parent.parent": "parent.parent.data.id"
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
		},
		"administrators": {
			"table": "app_users",
			"params": {
				"columns" : "id,username,first_name,last_name,email,privilege,location",
				"filters": {
					"privilege": 6,
					"application": "app"
				}
			},
			"compile": {
				"rows": "data",
				"value": {
					"privilege": "privilege.data"
				}
			}
		}
	}
}