/**
 * Contents.js
 *
 * @author 		:: Philleep Florence
 * @description :: Holds Project Specific API runtime configuration.
 * @directory 	:: api/config
 */

require('dotenv').config();

import moment from 'moment';

module.exports = {
	directus: {	
		collections: {
			articles: {
				feed: {
					rows: 'contents_posts',
					query: {
						columns: 'id,title,slug,description,synopsis,publish_date,image.name,source,category.name',
						filters: {
							post_type: 2,
							publish_date: {
								"<": moment().add(+1, 'days').format('YYYY-MM-DD')
							},
							unpublish_date: {
								">": moment().add(+1, 'days').format('YYYY-MM-DD')
							}
						},
						order: {
							publish_date: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_posts',
					query: {
						limit: 1,
						depth: 2
					}
				},
				related: {
					rows: 'joins_contents_posts_tags',
					query: {
						depth: 2,
						order: {
							id: 'DESC'
						}
					}
				}
			}, 
			beverages: {
				relationships: {
					rows: 'joins_contents_beverages_relationships',
					query: {
						depth: 2
					}
				},
				related: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						depth: 1
					}
				}
			},
			brands: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 8
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			}, 
			cocktails: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 3
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			}, 
			condiments: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 9
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			}, 
			countries: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 10
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			}, 
			factories: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 11
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			}, 
			garnishes: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 12
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			}, 
			manufacturers: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 5
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			},
			products: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 6
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			}, 
			regions: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 13
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			}, 
			sources: {
				feed: {
					rows: 'contents_beverages',
					query: {
						columns: 'id,name,slug,description,section,content,media.name,media.type',
						filters: {
							section: 14
						},
						order: {
							id: 'DESC'
						}						
					}
				},
				item: {
					rows: 'contents_beverages',
					query: {
						limit: 1,
						depth: 2
					}
				}
			},  
			events: {
				feed: {
					rows: 'contents_events',
					query: {
						columns: 'id,name,slug,description,location,category,description,end_date,end_time,start_date,start_time,media.name',
						filters: {
							start_date: {
								">": moment().add(-1, 'days').format('YYYY-MM-DD')
							}
						},
						order: {
							start_date: 'ASC'
						}
					}
				},
				item: {
					rows: 'contents_events',
					query: {
						limit: 1,
						depth: 2
					}
				}
			},  
			venues: {
				feed: {
					rows: 'contents_venues',
					query: {
						columns: 'id,name,slug,description,location,address,neighborhood,city,latitude,longitude,type.name,type.description,media.name',
						order: {
							synced: 'DESC'
						}
					}
				},
				item: {
					rows: 'contents_venues',
					query: {
						limit: 1,
						depth: 2
					}
				},
				neighborhood: {
					rows: 'contents_venues',
					query: {
						columns: 'id,name,slug,description,location,address,neighborhood,city,latitude,longitude,type.name,type.description,media.name',
						order: {
							synced: 'DESC'
						}
					}
				}
			}
		},			
		credentials: {
			access_token: process.env.API_TOKEN
		}
	}
}
