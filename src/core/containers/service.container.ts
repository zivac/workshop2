export class ServiceContainer {

    services: any[]

    constructor(services: any[]) {
        this.services = services;
    }

    loadServices(): void {
        this.services.forEach(service => this.loadService(service));
    }

    private loadService(Service: any): Object {
        if (!Service) return null;
        let serviceSingleton = this.services.find(item => item instanceof Service);
        if (serviceSingleton) return serviceSingleton;
        let dependencies = Reflect.getMetadata('design:paramtypes', Service) || [];
        serviceSingleton = new Service(...dependencies.map(dependency => this.loadService(dependency)));
        this.services.push(serviceSingleton);
        return serviceSingleton;
    }

}