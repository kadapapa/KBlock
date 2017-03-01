package cc.makeblock.mbot.ui.parts
{
	import flash.html.HTMLLoader;
	import flash.net.URLRequest;
	
	import cc.makeblock.mbot.uiwidgets.MyFrame;
	import cc.makeblock.mbot.util.PopupUtil;
	import cc.makeblock.menu.SystemMenu;
	
	import org.aswing.AsWingUtils;
	
	import translation.Translator;

	
	//////////////////////
	import flash.text.TextField
	//////////////////////////////////////
	public class HelpFrame extends MyFrame
	{
		private var ldr:HTMLLoader;
		
		public function HelpFrame()
		{
			setSizeWH(340, 440);
			ldr = new HTMLLoader();
			ldr.width = 550;
			ldr.height = 400;
			getContentPane().addChild(ldr);
		}
		
		override public function show():void
		{
			AsWingUtils.centerLocate(this);
			super.show();
			ldr.load(new URLRequest("static_tips/en/home.html"));
		}
		
		
		
		private var field:TextField = new TextField();

		
		private var Supportstr:String = "\r                                            " +
										"技术支持\r\r\r                             " +
										"Nickname: 宁静致远\r                             " +
										"E-mail: support@kadapapa.com\r                             " +
										" ";
		private var aboutstr:String = "\r                                            " +
									  "关于我们\r\r        " +
									  "我们是咔嗒爸爸的软件开发团队，" +
									  "咔嗒爸爸致力于基于开源硬件的电子产品和基于Scratch等软件的开发及应用的推广和普及，" +
									  "我们致力于打造中国青少年科技教育的生态圈，" +
									  "更多内容请访问我们的官方网站：http://www.kadapapa.com" ;
		private var scknowledgementsstr:String = "\r                                          " +
												 "Thanks for\r\r    " +
												 "the Scratch R&D team from M.I.T.\r    " +
												 "the mBlock R&D team from Makeblock\r    " +
												 "the workmate of Kadapapa";
		private var suggeststr:String = "\r                                            " +
										"建议反馈\r\r\r                             " +
										"E-mail:support@kadapapa.com\r                             " +
										"Telephone: (086)-022-58685580";
		
		public function MyHelp(_myhelp:String):void
		{
			setSizeWH(340, 220); //设置文本框大小
			x = 500;
			y = 250; //设置文本框位置
			field.x = 10;
			field.y = 25; //设置文本框位置
			field.width = 320;    //设置文本区宽度
			field.height  = 190;  //设置文本区高度
//			field.selectable = false; //文本是否可选
//			field.background= true;			
//			field.backgroundColor = 0xff;

//			field.setSizeWH(340, 220);
//			field.width = 550;
//			field.height = 400;
//			field.scrollV = 800;
//			field.border = true;
//			field.multiline = true;
//			field.scrollH = 500;

			field.wordWrap = true;
//			field.multiline = true;//文本段为多行文本字段
			switch(_myhelp)
			{
				case "support":
					field.text = Supportstr;	
				break;
				case "acknowledgements":
					field.text = scknowledgementsstr;	
				break;
				case "about":
					field.text = aboutstr;	
				break;
				case "suggest":
					field.text = suggeststr;	
				break;
			}
			addChild(field);
			super.show();
		}
	}	
}