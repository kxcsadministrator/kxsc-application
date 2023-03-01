const Model = require('./models');
const Retrieval = require("retrieval");
const fs = require('fs');
const axios = require('axios')

const USERS_BASE_URL = process.env.USERS_SERVICE

/* 
The functions in this file interact directly with the DB. These functions abstract away
all business logic related to the database hence can be used directly in any routes file.

The aim of this style of implementation is for the code in the routes to remain the same
irrespective of the type of db being used.
*/

//************************ Some helpers added here to prevent circular imports ***********************//
const get_resource_user_data = async(resource_id, headers) => {
    const publish_res = await axios({
        method: 'get',
        url: `${USERS_BASE_URL}/resource-data/${resource_id}`,
        headers: {'Authorization': `Bearer ${headers.authorization.split(' ')[1]}`}
    })

    return publish_res.data;
}

/*------------------------------ Resources Section ------------------------------------------ */
const create_new_resource = async (data)=>{
    const dataToSave = await data.save();
    return dataToSave;
}

const get_resource_by_id = async (id)=>{
    const data = await Model.resource.findById(id);
    return data;
}

const get_resource_data = async(id, headers) => {
    const resource = await Model.resource.findById(id);
    if (!resource) return null;

    const resource_data = await get_resource_user_data(id, headers);
    const files = await Model.resourceFile.find({parent: id}, {_id: 1, original_name: 1});
    const rating = await get_rating(id);

    const result = {
        "id": id,
        "author": resource_data.author,
        "topic": resource.topic,
        "description": resource.description,
        "institute": resource_data.institute,
        "category": resource.category,
        "sub_categories": resource.sub_categories,
        "visibility": resource.visibility,
        "resource_type": resource.resource_type,
        "citations": resource.citations,
        "rating": rating,
        "files": files,
        "date_created": resource.date
    }
    return result
}

const get_resource_by_topic = async (name)=>{
    const data = await Model.resource.findOne({'topic': name});
    return data;
}

// send a name or an id
const get_resource_by_topic_or_id = async (query)=>{
    let data = get_resource_by_topic(query)
    if (!data){
        data = get_resource_by_id(query)
    }
    return data;
}

const get_all_resources = async (category="None", sub_cat="None")=>{
    if (category === "None"){
        const data = await Model.resource.find({}, {_id: 1, topic: 1}).sort({"date": -1});
        return data;
    }
    if (category !== "None" && sub_cat === "None"){
        const data = await Model.resource.find({"category": category}, {_id: 1, topic: 1}).sort({"date": -1});
        return data;
    }

    else if (category !== "None" && sub_cat !== "None") {
        const data = await Model.resource.find({"category": category, "sub_categories": sub_cat}, {_id: 1, topic: 1}).sort({"date": -1});
        return data;
    }
    
}

const get_user_resources = async (author_id, institute_id = "None")=>{
    if (institute_id === "None"){
        const data = await Model.resource.find({author: author_id}, {_id: 1, topic: 1}).sort({"date": -1});
        return data;
    }
    else {
        const data = await Model.resource.find({author: author_id, institute: institute_id}, {_id: 1, topic: 1}).sort({"date": -1});
        return data;
    }
    
}

const get_public_resources = async (category="None", sub_cat="None")=>{
    const projection = {_id: 1, topic: 1}
    if (category === "None"){
        const data = await Model.resource.find({visibility: "public"}, projection).sort({"date": -1});
        return data;
    }
    if (category !== "None" && sub_cat === "None"){
        const data = await Model.resource.find({category: category, visibility: "public"}, projection).sort({"date": -1});
        return data;
    }

    else if (category !== "None" && sub_cat !== "None") {
        const data = await Model.resource.find({category: category, "sub_categories": sub_cat, visibility: "public"}, projection).sort({"date": -1});
        return data;
    }
    
}

const update_resource_topic = async (id, new_topic) => {
    const data = await Model.resource.findByIdAndUpdate(id, { topic: new_topic});
    const result = await Model.resource.findById(id);
    return result;
}

const update_resource_description = async (id, desc) => {
    const data = await Model.resource.findByIdAndUpdate(id, { description: desc});
    const result = await Model.resource.findById(id);
    return result;
}

const update_resource_category = async (id, new_category) => {
    const data = await Model.resource.findByIdAndUpdate(id, { category: new_category});
    const result = await Model.resource.findById(id);
    return result;
}

const update_visibility = async (id, new_visibility) => {
    const data = await Model.resource.findByIdAndUpdate(id, { visibility: new_visibility});
    const result = await Model.resource.findById(id);
    return result;
}

const update_resource_type = async (id, new_type) => {
    const data = await Model.resource.findByIdAndUpdate(id, { resource_type: new_type});
    const result = await Model.resource.findById(id);
    return result;
}

const add_resource_sub_categories =  async (id, subs) => {
    await Model.resource.findByIdAndUpdate(id, {$addToSet: {sub_categories: subs}});
    const result = await Model.resource.findById(id);
    return result;
}

const remove_resource_sub_categories = async (id, subs) => {
    await Model.resource.findByIdAndUpdate(id, {$pullAll: {sub_categories: subs}});
    const result = await Model.resource.findById(id);
    return result;
}

const add_resource_citations =  async (id, cites) => {
    await Model.resource.findByIdAndUpdate(id, {$addToSet: {citations: cites}});
    const result = await Model.resource.findById(id);
    return result;
}

const remove_resource_citations =  async (id, cites) => {
    await Model.resource.findByIdAndUpdate(id, {$pullAll: {citations: cites}});
    const result = await Model.resource.findById(id);
    return result;
}

const delete_resource_by_id = async (req) => {
    const id = req.params.id;

    const files = await Model.resourceFile.find({parent: id});
    if (files){
        files.map(p => {
            fs.unlink(p.path, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
            }
            )
        })
    }
    await Model.resourceFile.deleteMany({parent: id});
    const data = await Model.resource.findByIdAndDelete(id);
    return data;
}

const rate_resource = async (resource_id, user_id, value) => {
    const data = new Model.rating({
        resource: resource_id,
        author: user_id,
        score: value
    })
    const result = await data.save();
    let resource = await Model.resource.findByIdAndUpdate(resource_id, {$push: {ratings: [result._id]}});
    resource = await Model.resource.findById(resource_id);
    return resource;
}

const add_resource_file = async (resource_id, data) => {
    let idx = [];
    const dataToSave = await Model.resourceFile.insertMany(data);
    dataToSave.forEach(element =>{
        idx.push(element._id);
    });
    let parent = await Model.resource.findByIdAndUpdate(resource_id, {$addToSet: {files: idx}});
    parent = await Model.resource.findById(resource_id);
    return parent;
}

const validateRate = async (user_id, resource_id) => {
    const result = await Model.rating.findOne({author: user_id, resource: resource_id});
    if (result) return true;
    return false;
}

const get_rating = async (id) => {
    const ratings = []
    const data = await Model.rating.find({resource: id});

    data.map(p => {
        ratings.push(p.score);
    })

    if (!ratings.length) return {"average_rating": 0};
    let result = ratings.reduce((acc, c) => acc + c, 0) / ratings.length
    return {"average_rating": result};
}

const get_monthly_stats =  async () => {
    const result = await Model.resource.aggregate([
        {
            $group: {
                _id: {
                    // $dateToString:{format: "%Y-%m-%d"},
                    year: {$year: "$date"},
                    month: {$month: "$date"}
                }, 
                count:{ $sum: 1}
            }
        },
        {$sort: {count:1}} 
    ])
    return result;
}

const search_resource = async (keyword) => {
    let result = await Model.resource.aggregate([
        {
            $search: {
                index: 'default',
                text: {
                  query: `${keyword}`,
                  path: {
                    'wildcard': '*'
                  }
                }
            }
        },
        {
            "$project": {
                "topic": 1,
                "score": { "$meta": "searchScore"},
            }
          }
    ])
    return result;
}

/*------------------------------ Categories Section ------------------------------------------ */
const create_new_category = async (data) => {
    const dataToSave = await data.save();
    return dataToSave;
}

const get_category_by_id = async (id)=>{
    const data = await Model.category.findById(id);
    return data;
}

const get_category_by_name = async (name)=>{
    const data = await Model.category.findOne({'name': name});
    return data;
}

const get_all_categories = async ()=>{
    const data = await Model.category.find();
    return data;
}

const add_sub_categories =  async (id, subs) => {
    await Model.category.findByIdAndUpdate(id, {$addToSet: {sub_categories: subs}});
    const result = await Model.category.findById(id);
    return result;
}

const remove_sub_categories = async (id, subs) => {
    await Model.category.findByIdAndUpdate(id, {$pullAll: {sub_categories: subs}});
    const result = await Model.category.findById(id);
    return result;
}

const update_category_by_id = async (id, new_name) => {
    let updateObj = {name: new_name};
    
    await Model.category.findByIdAndUpdate(id, updateObj);
    const result = await Model.category.findById(id);
    return result;

}


const delete_category_by_id = async (req) => {
    const id = req.params.id;
    const data = await Model.category.findByIdAndDelete(id);
    return data;
}

/*----------------------------------- BM25 Similarity Search -------------------------------*/
const similarity = async (query) => {
    let resources = await get_all_resources();
    let docs = [];
    
    resources.forEach(element => {
        docs.push(element.description);
    });
    
    let rt = new Retrieval(K=1.6, B=0.75);

    rt.index(docs);
 
    // 3rd step: search. In other words, multiply the document-term matrix and the indicator vector representing the query.
    let data = rt.search(query, 10)
    let results = await Model.resource.find({"description": data})
    return results;
}

module.exports = {
    get_resource_by_id, get_all_resources, create_new_resource, delete_resource_by_id, create_new_category, 
    get_category_by_id, get_all_categories, update_category_by_id, delete_category_by_id, get_category_by_name, 
    rate_resource, get_rating, search_resource, similarity, update_resource_category, get_resource_by_topic_or_id, 
    add_sub_categories, remove_sub_categories, get_resource_by_topic, update_resource_topic, update_resource_description, 
    update_visibility, update_resource_type, add_resource_sub_categories, remove_resource_sub_categories, add_resource_citations,
    remove_resource_citations, add_resource_file, get_public_resources, get_monthly_stats, validateRate, get_user_resources,
    get_resource_data
}