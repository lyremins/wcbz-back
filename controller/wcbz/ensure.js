'use strict';

import ensureModel from '../../models/wcbz/ensure'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Ensure extends BaseComponent{
	constructor(){
		super()
		this.addEnsure = this.addEnsure.bind(this);
		this.getEnsure = this.getEnsure.bind(this);
		this.getEnsureCount = this.getEnsureCount.bind(this);
		this.getEnsureDetail = this.getEnsureDetail.bind(this);
		this.updateEnsure = this.updateEnsure.bind(this);
		this.deleteEnsure = this.deleteEnsure.bind(this);
	}
	//添加人员
	async addEnsure(req, res, next){
        let ensure_id;
		try{
            ensure_id = await this.getId('ensure_id');
            console.log(ensure_id);
		}catch(err){
			console.log('获取id失败');
			res.send({
				type: 'ERROR_DATA',
				message: '获取数据失败'
			})
			return
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const opening_hours = fields.startTime&&fields.endTime? fields.startTime + '/' + fields.endTime : "8:30/20:30";
			const newEnsure = {
                ensure_id,
				filed1: fields.filed1,
                filed2: fields.filed2,
                filed3: fields.filed3,
                filed4: fields.filed4,
                filed5: fields.filed5,
                filed6: fields.filed6,
                create_time: dtime().format('YYYY-MM-DD HH:mm')
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const ensure = new ensureModel(newEnsure);
				await ensure.save();
				res.send({
					status: 1,
					sussess: '添加成功'
				})
			}catch(err){
				console.log('写入数据库失败');
				res.send({
					status: 0,
					type: 'ERROR_SERVER',
					message: '添加失败',
				})
			}
		})
    }
    // 查询人员
	async getEnsure(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await ensureModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取用户列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取用户列表数据失败'
			})
		}
    }
    // 查询人员条数
    async getEnsureCount(req, res, next){
		try{
			const count = await ensureModel.count()
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取管理员数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_COUNT',
				message: '获取管理员数量失败'
			})
		}
    }
    // 获取人员详情
	async getEnsureDetail(req, res, next){
        console.log(req.params);
		const ensure_id = req.params.Ensure_id;
		if (!ensure_id || !Number(ensure_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const ensure = await ensureModel.findOne({ensure_id});
            console.log(ensure);
			res.send(ensure)
		}catch(err){
			console.log('获取人员详情失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取人员详情失败'
			})
		}
    }
    // 更新人员
    async updateEnsure(req, res, next){
        const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取信息form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return
			}
			const {filed1, filed2,filed3,filed4,filed5,filed6,} = fields;
			try{
				let newData;
				newData = {filed1,filed2,filed3,filed4,filed5}
				await ensureModel.findOneAndUpdate({ensure_id}, {$set: newData});
				res.send({
					status: 1,
					success: '修改信息成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE_RESTAURANT',
					message: '更新信息失败',
				})
			}
		})
    }
    // 删除人员
    async deleteEnsure(req, res, next){
        console.log(req.params);
        const ensure_id = req.params.Ensure_id;
        console.log(ensure_id);
		if (!ensure_id || !Number(ensure_id)) {
			console.log('ensure_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ensure_id参数错误',
			})
			return
		}
		try{
			await ensureModel.findOneAndRemove({ensure_id});
			res.send({
				status: 1,
				success: '删除成功',
			})
		}catch(err){
			console.log('删除失败', err);
			res.send({
				status: 0,
				type: 'DELETE_RESTURANT_FAILED',
				message: '删除失败',
			})
		}
	}
}

export default new Ensure()