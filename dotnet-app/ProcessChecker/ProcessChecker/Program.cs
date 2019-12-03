using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
namespace ProcessChecker
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Process proc = Process.GetProcessesByName("IDALEON")[0]; // Получаем процесс прогаммы 
                Console.Write("true");
            }
            catch (System.IndexOutOfRangeException) // Если процесс не найден
            {
                Console.Write("false");
            }
            Console.ReadKey();

        }
     
    }
}
