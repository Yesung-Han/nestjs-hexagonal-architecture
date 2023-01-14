# NestJS with Hexagonal Architecture

원티드 프리온보딩 [실무 함수형 프로그래밍 백엔드 과정](https://pollen-port-115.notion.site/1-ebb18418356d4b078cbcc803fb3a4a14) 2강을 수강하면서 개인적으로 정리한 내용 입니다.  


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

### NestJS의 IoC, DI

먼저 헷갈리는 용어들에대해 정리를 해보자 ([참고 문서](https://www.tutorialsteacher.com/ioc/introduction))
- Inversion of control (IoC, 제어 역전)  
시스템간의 느슨한 결합을 위해 "컨트롤"의 주체를 "역전"시키자는 원칙.  
컨트롤 : 주요 책임 외에 클래스가 같는 모든 추가 책임들을 말한다. (의존하고 있는 객체의 생성 등)  
역전 : 처음에는 이 역전이라는 말이 안와 닿았다. "역전" 보다는 "위임"이라는 말이 더 적절한 것이 아닐까 생각 되었다. 그런데 내가 상대방에게 어떤 일의 처리를 위임한다는 것은 그 일의 처리자가 나에서 상대방으로 역전되었다고 볼수있다. 내가 직접 컨트롤 하는 입장에서 컨트롤을 다른 시스템에 넘김으로서 컨트롤의 주체가 나에서 -> 넘겨진 시스템으로 바뀌게(역전) 된다  
예시) 자동차 직접 몰기 VS 택시 이용하기  
자동차를 직접 몰면 내가 자동차를 다 제어해야 하지만, 택시를 타면 내가 자동차를 제어하지 않아도 된다. 자동차 제어의 주체가 나에서 택시기사라는 새로운 객체로 역전된다.

- Dependency Injection (IoC, 의존성 주입)  
IoC 원칙에 기반한 종속 객체 생성에 대한 패턴 입니다.([원칙 VS 패턴](https://www.tutorialsteacher.com/articles/difference-between-design-principle-and-design-pattern))  
클래스 내부에서 필요한 다른 객체를 직접 생성해서 사용하는 것이아니라 클래스 외부에서 생성 하고, 외부에서 생성된 종속성 객체를 여러 방법으로 가져와 사용하는 패턴.


- Dependency Inversion Principle (DIC, 의존 역전의 원칙)  
SOLID 원칙의 D  
상위 수준의 모듈이 하위 수준의 모듈에 직접 의존해서는 안된다.  
상위 수준? 하위 수준?: 변화하기 쉬운 부분이 하위 수준, 변화 하기 어려운 부분이 상위 수준이라고 생각 할 수 있다. 즉 상위 시스템이 변화 하기 쉬운 하위 부분에 직접 의존하는 관계를 지양하자는 원칙 상위 수준은 기능이 추상화된 인터페이스에만 의존하고, 하위 수준들은 그 인터페이스를 통해 구현하는 방식을 적용 할 수 있다.

- IoC Container
자동 종속성 주입을 구현하기 위한 프레임워크  
종속 되는 객체들을 생성해 가지고 있는 다음, 생성된 종속 객체들을 필요로 하는 다른 객체들에게 전달 하거나 직접 주입 합니다.
종속 객체들을 언제 생성하고 소멸 시킬지 생명주기를 관리하는 부분도 여기에서 합니다.

NestJS Providers 에서 new CatsService()로 종속 객체를 직접 생성 할 필요 없이, 미리 생성된 인스턴스를 주입받아 사용(DI)한다고 했는데 이 부분과 관련이 있다.
디펜던시로 사용되는 클래스(Injectable 데코레이터가 붙은 클래스)들의 인스턴스의 생성을 IoC Container 역할을 하는 NestJS 런타임이 대신 해주기 때문에 각 클래스에서는 자신이 의존하고 있는 종속 객체의 생명 주기에 대해 제어 할 필요가 없다.(제어권이 넘어감 => IoC)

*NestJS 런타임은 providers에 지정된 클래스를 인스턴스화 할때 DEFAULT로 싱글톤 객체로 생성 한다. 생성된 싱글톤 객체의 생명주기는 기본적으로 앱의 생명주기와 같게 된다. 앱이 시작할때 싱글톤 객체가 생성되고 생성된 객체는 런타임 내내 유지된다.(참고 : [provider scope](https://docs.nestjs.com/fundamentals/injection-scopes))

DI 패턴, 어떤 점이 좋을까?  
=> 객체들간의 "결합도를 낮추는 것"이 핵심이다. 만약 A클래스에서 직접 B클래스를 생성해서 사용한다면, B클래스의 생성 로직이 바뀌었을때, A클래스 코드에서 B클래스 생성하는 부분까지 수정해야한다. IoC는 이러한 부분에서의 의존관계가 있는 클래스간 결합도를 낮출 수 있다.











