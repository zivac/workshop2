import { Query, Get, Param, HttpError, Post, Body, Delete } from "../index";

export abstract class CrudController {

    model: any;

    constructor(T: any) {
        this.model = T;
    }

    @Get('/')
    async find(@Query() filters: Object): Promise<any[]> {
        return await this.model.find(filters);
    }

    @Get('/:id')
    async findOne(@Param('id', true) id: string): Promise<any> {
        let results = await this.model.find({_id: id})
        if(!results.length) throw new HttpError(404, 'Not found');
        return results[0];
    }

    @Post('/')
    async create(@Body() data: Object): Promise<any> {
        let model = new this.model(data);
        await model.save();
        return model;
    }

    @Post('/:id')
    async update(@Param('id', true) id: string, @Body() data: Object): Promise<void> {
        return await this.model.update(id, data);
    }

    @Delete('/:id')
    async delete(@Param('id', true) id: string): Promise<void> {
        return await this.model.delete(id);
    }

}