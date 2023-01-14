# NestJS with Hexagonal Architecture

원티드 프리온보딩 [실무 함수형 프로그래밍 백엔드 과정](https://pollen-port-115.notion.site/1-ebb18418356d4b078cbcc803fb3a4a14) 2강을 수강하면서 정리한 내용 입니다.  


## 1. Nest.js 의 주요 컨샙
<center><image src="./nestjs.png" /></center>
<center>nestjs는 controller, provider, module로 단위로 구성된다.</center>
<br><br>

### controller 란?
어플리케이션으로 들어오는 요청을 받는 첫 단계! 즉 외부세계로 부터 들어온 요청이 어느곳으로 가야하는지 라우팅 하는 역할을 한다.
```typescript
  import { Controller, Get } from '@nestjs/common';
  
  @Controller('cats') // 상위 경로 지정: 별도 라우터 설정 없이 @Controller 데코레이터를 달아주면, localhost:300/cats 로 오는 요청이 처리 됨.
  export class CatsController {
    @Get() // 하위 경로 지정: localhost:300/cats/ 로 들어오는 요청이 아래 함수에서 처리 됨.
    async findAll(): Promise<string> {
      return 'This action returns all cats';
    }
  }
```

@Controller : 해당 클래스가 컨트롤러 라는 것을 명시함.  
@Get, @Post, @Put, @Patch ... : REST API 메소드
<br><br>

### Providers 란?
Nest.js의 근본, 대다수의 클래스들이 provider로 사용될 수 있고, provider로 사용된 클래스는 다른 클래스의 디펜던시로 주입될 수 있다.  
예를 들면 컨트롤러에서는 HTTP요청을 핸들링 하고, 더 복잡한 일들은 provider에게 위임 해야한다.  
provider는 그저 JS의 class일 분 이다.

```typescript
@Injectable() // provider로 사용할 클래스
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }  
}

@Controller('cats') 
  export class CatsController {
  constructor(private catsService: CatsService) {} // new CatsService 할 필요 없이 바로 미리 생성된 인스턴스를 가져다 쓸 수 있다.
  
  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
}
```
<br>

### Modules 란?
도메인을 설정 할 때 도메인 별로 같은 도메인에 속한 것들을 응집화 할수있도록 도와줌.  
앱의 사이즈가 커질수록, 경계를 설정해서 복잡도를 매니징 할 수 있다.
```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController], // 해당 도메인에서 사용하는 컨트롤러 지정
  providers: [CatsService], // 해당 모듈에서 필요로 하는 디펜젼시 지정
})
export class CatsModule {}
```
<br>

### NestJS의 Dependency Injection (DI)
Inversion of control (IoC)  

위 Providers 에서 new CatsService 할 필요 없이 바로 미리 생성된 인스턴스를 사용한다고 했는데 이 부분과 관련이 있다.
디펜턴시로 사용되는 클래스(Injectable 데코레이터가 붙은 클래스)들의 인스턴스화를 Ioc컨테이터 역할을 하는 NestJS 런타임이 대신 해주기 때문에 